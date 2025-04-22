// Wait for the document to be fully loaded before running any code
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const previousOperandElement = document.getElementById('previous-operand');
    const currentOperandElement = document.getElementById('current-operand');
    const numberButtons = document.querySelectorAll('.number');
    const operatorButtons = document.querySelectorAll('.operator');
    const equalsButton = document.getElementById('equals');
    const clearButton = document.getElementById('clear');
    const deleteButton = document.getElementById('delete');
    const percentButton = document.getElementById('percent');

    // Calculator state
    let currentOperand = '0';
    let previousOperand = '';
    let operation = undefined;
    let shouldResetScreen = false;

    console.log('Calculator initialized');
    console.log('Number buttons found:', numberButtons.length);

    // Function to update display
    function updateDisplay() {
        currentOperandElement.textContent = currentOperand;
        
        if (operation != null) {
            previousOperandElement.textContent = `${previousOperand} ${getOperationSymbol(operation)}`;
        } else {
            previousOperandElement.textContent = previousOperand;
        }
    }

    // Helper function to get operation symbol
    function getOperationSymbol(op) {
        switch(op) {
            case 'add': return '+';
            case 'subtract': return '-';
            case 'multiply': return '×';
            case 'divide': return '÷';
            default: return '';
        }
    }

    // Function to append number
    function appendNumber(number) {
        console.log('Appending number:', number);
        if (currentOperand === '0' || shouldResetScreen) {
            resetScreen();
        }
        
        // Don't allow multiple decimals
        if (number === '.' && currentOperand.includes('.')) return;
        
        currentOperand = currentOperand.toString() + number.toString();
        updateDisplay();
    }

    // Function to reset screen
    function resetScreen() {
        currentOperand = '';
        shouldResetScreen = false;
    }

    // Function to clear calculator
    function clear() {
        currentOperand = '0';
        previousOperand = '';
        operation = undefined;
        updateDisplay();
    }

    // Function to delete last digit
    function deleteNumber() {
        if (currentOperand === '0') return;
        
        if (currentOperand.length === 1) {
            currentOperand = '0';
        } else {
            currentOperand = currentOperand.slice(0, -1);
        }
        
        updateDisplay();
    }

    // Function to handle operator selection
    function chooseOperation(op) {
        if (currentOperand === '0') return;
        
        if (previousOperand !== '') {
            compute();
        }
        
        operation = op;
        previousOperand = currentOperand;
        shouldResetScreen = true;
        updateDisplay();
    }

    // Function to compute result
    function compute() {
        let computation;
        const prev = parseFloat(previousOperand);
        const current = parseFloat(currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (operation) {
            case 'add':
                computation = prev + current;
                break;
            case 'subtract':
                computation = prev - current;
                break;
            case 'multiply':
                computation = prev * current;
                break;
            case 'divide':
                if (current === 0) {
                    alert("Cannot divide by zero!");
                    clear();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        
        // Format result to avoid long decimal numbers
        if (computation % 1 !== 0) {
            computation = computation.toFixed(8);
            // Remove trailing zeros
            computation = parseFloat(computation);
        }
        
        currentOperand = computation.toString();
        operation = undefined;
        previousOperand = '';
        updateDisplay();
    }

    // Function to handle percentage
    function calculatePercentage() {
        if (currentOperand === '0') return;
        
        // If we're in the middle of an operation
        if (operation && previousOperand !== '') {
            const current = parseFloat(currentOperand);
            const prev = parseFloat(previousOperand);
            
            switch (operation) {
                case 'add':
                case 'subtract':
                    // Calculate percentage of the first number
                    currentOperand = (prev * (current / 100)).toString();
                    break;
                case 'multiply':
                case 'divide':
                    // Simple percentage
                    currentOperand = (current / 100).toString();
                    break;
            }
        } else {
            // Simple percentage calculation
            currentOperand = (parseFloat(currentOperand) / 100).toString();
        }
        
        updateDisplay();
    }

    // Add click events to each button by ID (reliable method)
    function attachButtonEventById(id, value) {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener('click', function() {
                console.log('Button clicked:', id, value);
                appendNumber(value);
            });
        }
    }
    
    // Attach events to number buttons by ID
    attachButtonEventById('one', '1');
    attachButtonEventById('two', '2');
    attachButtonEventById('three', '3');
    attachButtonEventById('four', '4');
    attachButtonEventById('five', '5');
    attachButtonEventById('six', '6');
    attachButtonEventById('seven', '7');
    attachButtonEventById('eight', '8');
    attachButtonEventById('nine', '9');
    attachButtonEventById('zero', '0');
    attachButtonEventById('decimal', '.');
    
    // Also add event listeners using querySelectorAll for redundancy
    // Removed to prevent double appending of numbers
    // numberButtons.forEach(button => {
    //     button.addEventListener('click', function() {
    //         console.log('Number button clicked via forEach:', this.textContent);
    //         appendNumber(this.textContent);
    //     });
    // });

    // Add events to operator buttons
    operatorButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Operator clicked:', this.id);
            chooseOperation(this.id);
        });
    });

    // Add events for other buttons
    if (equalsButton) {
        equalsButton.addEventListener('click', function() {
            console.log('Equals clicked');
            compute();
        });
    }

    if (clearButton) {
        clearButton.addEventListener('click', function() {
            console.log('Clear clicked');
            clear();
        });
    }

    if (deleteButton) {
        deleteButton.addEventListener('click', function() {
            console.log('Delete clicked');
            deleteNumber();
        });
    }

    if (percentButton) {
        percentButton.addEventListener('click', function() {
            console.log('Percent clicked');
            calculatePercentage();
        });
    }

    // Also add keyboard support
    document.addEventListener('keydown', function(event) {
        console.log('Key pressed:', event.key);
        
        // Handle number keys (0-9) and decimal
        if (!isNaN(parseFloat(event.key)) || event.key === '.') {
            appendNumber(event.key);
        }
        
        // Handle operators
        switch(event.key) {
            case '+':
                chooseOperation('add');
                break;
            case '-':
                chooseOperation('subtract');
                break;
            case '*':
                chooseOperation('multiply');
                break;
            case '/':
                chooseOperation('divide');
                break;
            case '%':
                calculatePercentage();
                break;
            case 'Enter':
            case '=':
                compute();
                break;
            case 'Backspace':
                deleteNumber();
                break;
            case 'Escape':
                clear();
                break;
        }
    });

    // Initialize display
    updateDisplay();
    console.log('Calculator ready');
});

// Add an additional safety check in case DOMContentLoaded already fired
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('Document already loaded, initializing calculator');
    // Trigger the initialization manually
    setTimeout(function() {
        const event = new Event('DOMContentLoaded');
        document.dispatchEvent(event);
    }, 100);
}