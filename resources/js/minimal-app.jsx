console.log('=== MINIMAL APP.JSX LOADING ===');

// Try without any imports first
const element = document.getElementById('app');
if (element) {
    element.innerHTML = '<h1 style="color: green;">Basic JS in JSX file works!</h1>';
}

// Now try with React
try {
    console.log('=== IMPORTING REACT ===');
    const React = await import('react');
    const ReactDOM = await import('react-dom/client');
    
    console.log('=== REACT IMPORTED SUCCESSFULLY ===');
    
    const root = ReactDOM.createRoot(element);
    root.render(React.createElement('h1', {style: {color: 'blue'}}, 'React is working!'));
    
    console.log('=== REACT RENDERED ===');
} catch (error) {
    console.error('=== REACT ERROR ===', error);
    element.innerHTML = '<h1 style="color: red;">React Error: ' + error.message + '</h1>';
}