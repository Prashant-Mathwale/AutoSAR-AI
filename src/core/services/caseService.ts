
import { getServiceSupabase } from '@/lib/db';
import { CaseData, RuleEngineOutput } from '../types';

export class CaseService {
    /**
     * Creates a new case with all related data (normalized data, rule outputs)
     */
    static async createCase(caseData: CaseData, ruleOutput: RuleEngineOutput): Promise<void> {
        const supabase = getServiceSupabase();
        const { case_id } = caseData;
        const timestamp = new Date().toISOString();

        // 1. Create Base Case Record
        const { error: caseError } = await supabase.from('cases').insert({
            case_id: case_id,
            status: 'DRAFT_READY', // Default status
            created_at: timestamp,
            last_updated_at: timestamp,
            rule_engine_version: ruleOutput.rule_engine_version
        });

        if (caseError) throw new Error(`Failed to create case: ${caseError.message}`);

        // 2. Insert Normalized Data
        const { error: dataError } = await supabase.from('case_data_normalized').insert({
            case_id: case_id,
            customer_profile: caseData.customer,
            transaction_list: caseData.transactions,
            alert_metadata: {
                alert_date: caseData.alert_date,
                risk_score: ruleOutput.aggregated_risk_score,
                classification: ruleOutput.final_classification
            },
            transaction_summary: {
                total_amount: ruleOutput.calculated_metrics?.total_transaction_value_inr || 0,
                transaction_count: ruleOutput.calculated_metrics?.transaction_count || 0,
                average_amount: ruleOutput.calculated_metrics?.average_transaction_value || 0,
                date_range: {
                    start: caseData.transactions.length > 0 ? caseData.transactions[0].date : new Date().toISOString(),
                    end: caseData.transactions.length > 0 ? caseData.transactions[caseData.transactions.length - 1].date : new Date().toISOString()
                }
            }
        });

        if (dataError) {
            // Rollback (delete case) - simpler than full transaction for now
            await supabase.from('cases').delete().eq('case_id', case_id);
            throw new Error(`Failed to insert case data: ${dataError.message}`);
        }

        // 3. Insert Rule Engine Output
        const { error: ruleError } = await supabase.from('rule_engine_outputs').insert({
            case_id: case_id,
            execution_timestamp: ruleOutput.execution_timestamp,
            rule_engine_config_id: ruleOutput.rule_engine_version,
            triggered_rules: ruleOutput.triggered_rules,
            calculated_metrics: ruleOutput.calculated_metrics,
            typology_tags: ruleOutput.typology_tags,
            aggregated_risk_score: ruleOutput.aggregated_risk_score,
            suspicion_summary_json: ruleOutput.suspicion_summary_json,
            final_classification: ruleOutput.final_classification
        });

        if (ruleError) {
            console.error(`Failed to insert rule output for ${case_id}: ${ruleError.message}`);
        }
    }

    static async getCase(caseId: string) {
        const supabase = getServiceSupabase();
        const { data, error } = await supabase
            .from('cases')
            .select(`
            *,
            case_data_normalized(*),
            rule_engine_outputs(*)
        `)
            .eq('case_id', caseId)
            .single();

        if (error) throw error;
        return data;
    }

    static async saveSARDraft(caseId: string, narrative: string): Promise<void> {
        const supabase = getServiceSupabase();
        const { error } = await supabase.from('sar_drafts').insert({
            case_id: caseId,
            version_number: 1,
            narrative_text: narrative,
            source_event: 'AUTO_GENERATED',
            is_final_submission: false
        });

        if (error) {
            console.error(`Failed to save SAR draft for ${caseId}: ${error.message}`);
            // Non-blocking error
        }
    }
}
