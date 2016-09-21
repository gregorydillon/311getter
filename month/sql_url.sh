wget 'https://data.sfgov.org/resource/qer8-n8u9.csv?$select=date_trunc_ym(opened) as month, count(*)&$order=month&$group=month&$where=opened >= "2015-02-01"' -O report.csv
