import os
import subprocess
import time
import webbrowser
import sys

def main():
    print("==================================================")
    print("      Booting Fasal Kavach System...              ")
    print("==================================================")
    
    base_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(base_dir, 'backend')
    frontend_dir = os.path.join(base_dir, 'frontend')

    # Start Backend API
    print("[*] Starting AI Backend Server on Port 5000...")
    backend_process = subprocess.Popen([sys.executable, "app.py"], cwd=backend_dir)

    # Start Frontend Server
    print("[*] Starting Frontend Web Server on Port 8000...")
    frontend_process = subprocess.Popen([sys.executable, "-m", "http.server", "8000"], cwd=frontend_dir)

    print("[*] Servers are spinning up! Waiting 2 seconds...")
    time.sleep(2)

    # Auto-Launch Browser
    dashboard_url = "http://localhost:8000/index.html"
    print(f"[*] Auto-opening Fasal Kavach Dashboard at {dashboard_url} ...")
    webbrowser.open(dashboard_url)

    print("==================================================")
    print("      System is LIVE! Press Ctrl+C to shut down.  ")
    print("==================================================")

    try:
        backend_process.wait()
        frontend_process.wait()
    except KeyboardInterrupt:
        print("\n[*] Shutting down Fasal Kavach System...")
        backend_process.terminate()
        frontend_process.terminate()
        print("[*] Shutdown complete.")

if __name__ == "__main__":
    main()
