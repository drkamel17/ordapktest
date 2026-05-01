import http.server
import webbrowser
import os
import socketserver
import threading

# Configuration
PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def log_message(self, format, *args):
        # Custom log format
        print(f"[{self.log_date_time_string()}] {args[0]}")

def start_server():
    """Start the HTTP server"""
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"\n{'='*60}")
        print(f"🚀 Server is running!")
        print(f"{'='*60}")
        print(f"📍 URL: http://localhost:{PORT}")
        print(f"📁 Directory: {DIRECTORY}")
        print(f"{'='*60}")
        print(f"Press Ctrl+C to stop the server\n")
        httpd.serve_forever()

def main():
    # Start server in a separate thread
    server_thread = threading.Thread(target=start_server, daemon=True)
    server_thread.start()
    
    # Wait a moment for server to start
    import time
    time.sleep(1)
    
    # Open browser
    url = f"http://localhost:{PORT}/index.html"
    print(f"\n🌐 Opening {url} in your browser...")
    webbrowser.open(url)
    
    try:
        # Keep the main thread alive
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n\n👋 Shutting down server...")
        exit(0)

if __name__ == "__main__":
    main()
