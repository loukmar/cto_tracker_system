<!DOCTYPE html>
<html>
<head>
    <title>Test Login</title>
</head>
<body>
    <h1>Test API Login</h1>
    <form id="loginForm">
        <input type="email" id="email" placeholder="Email" value="admin@example.com"><br>
        <input type="password" id="password" placeholder="Password" value="password"><br>
        <button type="submit">Login</button>
    </form>
    <div id="result"></div>

    <script>
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        email: document.getElementById('email').value,
                        password: document.getElementById('password').value,
                    })
                });
                
                const data = await response.json();
                document.getElementById('result').innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
            } catch (error) {
                document.getElementById('result').innerHTML = 'Error: ' + error.message;
            }
        });
    </script>
</body>
</html>