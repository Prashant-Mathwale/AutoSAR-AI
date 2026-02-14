
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function debugFetch() {
    // Dynamic import to ensure env vars are loaded first
    const { getServiceSupabase } = await import('./src/lib/db');
    console.log('Debugging GET /api/cases query...');
    const supabase = getServiceSupabase();

    const { data, error } = await supabase
        .from('cases')
        .select(`
        case_id,
        created_at,
        status,
        rule_engine_outputs (
          aggregated_risk_score
        ),
        case_data_normalized (
          customer_profile
        )
      `)
        .order('created_at', { ascending: false })
        .limit(2);

    if (error) {
        console.error('Query Error:', error);
        return;
    }

    console.log('Raw Data Structure (First 2 rows):');
    console.log(JSON.stringify(data, null, 2));

    // Test access logic
    const row = data[0];
    if (row) {
        console.log('\nAccess Logic Test:');
        console.log('rule_engine_outputs is array?', Array.isArray(row.rule_engine_outputs));
        console.log('case_data_normalized is array?', Array.isArray(row.case_data_normalized));
    }
}

debugFetch();
