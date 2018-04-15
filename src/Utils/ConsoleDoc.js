export default class ConsoleDoc {
    static printHelpOnConsole() {
        if (process.env.NODE_ENV === 'test') {
            return;
        }
        
        console.log(`
        Hello! Here are some tips you must think useful:
        Query documentation (https://docs.loganalytics.io/docs/Language-Reference/):
        Severity levels:
        0: 'verbose',
        1: 'information',
        2: 'warning',
        3: 'error',
        4: 'critical'
    
        Query samples:
        traces | where severityLevel != 2 | sort by timestamp desc | limit 200
        traces | where message has 'Error' | sort by timestamp desc | limit 200
        exceptions | sort by timestamp desc | limit 200
    
        Share a url: ${window.location.href}?app_id={your_app_id}&api_key={your_api_key}
        `);
    }
}