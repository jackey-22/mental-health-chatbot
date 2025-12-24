# Kill any running Streamlit processes
Get-Process streamlit -ErrorAction SilentlyContinue | Stop-Process -Force

# Wait a moment
Start-Sleep -Seconds 2

# Clear Streamlit cache
Remove-Item -Path "$env:USERPROFILE\.streamlit\cache" -Recurse -ErrorAction SilentlyContinue

# Start Streamlit with fresh configuration
streamlit run app.py --server.headless=true
