class ConsoleDoc {
  printHelpOnConsole() {
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    console.log(
`Hello! Here are some tips you must think useful:
Query documentation (https://docs.loganalytics.io/docs/Language-Reference/):
Severity levels:
0: 'verbose',
1: 'information',
2: 'warning',
3: 'error',
4: 'critical'

Query samples:
traces | where severityLevel > 2 | sort by timestamp desc | limit 200
traces | where message has 'Error' | sort by timestamp desc | limit 200
exceptions | sort by timestamp desc | limit 200
union exceptions, traces | sort by timestamp desc | limit 200
traces | where timestamp > todatetime("2018-04-26 10:20:00Z") | sort by timestamp desc | limit 100
traces | where timestamp > ago(1h)

Share a url: ${window.location.href.split('?')[0]}?app_id={your_app_id}&api_key={your_api_key}`);
  }
}
const consoleDoc = new ConsoleDoc();
export default consoleDoc;