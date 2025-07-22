<!DOCTYPE html>
<html>
<head>
    <title>Debug Page</title>
</head>
<body>
    <h1>Laravel is working!</h1>
    <div id="app">
        <p>If you see this, Laravel is serving the page but React hasn't loaded.</p>
    </div>
    
    <script>
        console.log('Inline script working');
        console.log('App element exists:', document.getElementById('app'));
    </script>
    
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/test.jsx'])
</body>
</html>