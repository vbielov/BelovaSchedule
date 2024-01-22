@REM explorer "http://localhost:80"
@REM serve -l 80 -s dist
serve --ssl-cert ./ssl/certificate.pem --ssl-key ./ssl/private-key.pem -s dist -l 443
pause