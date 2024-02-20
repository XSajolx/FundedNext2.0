// Consolidated DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function () {
    const pipValues = {
        'AUDCAD': 7.24, 'AUDCHF': 11.09, 'AUDJPY': 6.59, 'AUDNZD': 5.89,
        'AUDSGD': 7.35, 'AUDUSD': 10.00, 'CADCHF': 11.09, 'CADJPY': 6.59,
        'CADSGD': 7.35, 'CHFJPY': 6.59, 'EURAUD': 6.38, 'EURCAD': 7.24,
        'EURCHF': 11.09, 'EURGBP': 12.25, 'EURHKD': 1.28, 'EURHUF': 2.84,
        'EURJPY': 6.61, 'EURNOK': 0.90, 'EURNZD': 5.90, 'EURSGD': 7.36,
        'EURTRY': 0.35, 'EURUSD': 10.00, 'GBPAUD': 6.36, 'GBPCAD': 7.23,
        'GBPCHF': 11.09, 'GBPJPY': 6.61, 'GBPNZD': 5.90, 'GBPSEK': 7.36,
        'GBPSGD': 7.36, 'GBPUSD': 10.00, 'MXNJPY': 6.61, 'NOKJPY': 6.60,
        'NZDCAD': 7.23, 'NZDCHF': 11.09, 'NZDJPY': 6.61, 'NZDSGD': 7.36,
        'SGDJPY': 6.61, 'USDCAD': 7.23, 'USDCHF': 11.09, 'USDCHN': 1.37,
        'USDDKK': 1.43, 'USDHKD': 1.28, 'USDJPY': 6.61, 'USDMXN': 0.56,
        'USDNOK': 0.90, 'USDPLN': 2.42, 'USDSGD': 7.36, 'USDTRY': 0.35,
        'USDZAR': 0.53, 'ZARJPY': 6.61, 'NZDUSD': 10.00, 'USDHKD': 1.28,
        // Indices
        'SPX500': 10.00, 'US30': 10.00, 'GER30': 10.67, 'US2000': 10.00,
        'UK100': 12.20, 'VIX': 10.00, 'SWI20': 11.08, 'NTH25': 21.34,
        'NDX100': 10.00, 'JP225': 0.07, 'HK50': 1.28, 'FRA40': 10.67,
        'EUSTX50': 10.67, 'AUS200': 6.35,
        // Commodities
        'XAUUSD': 10.00, 'XTIUSD': 10.00, 'XAGUSD': 50.00, 'USOUSD': 1.00,
        'UKOUSD': 1.00,
      };
    // Attach event listeners for sidebar links
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const sectionId = link.getAttribute('href');
            showSection(sectionId);
        });
    });
    function hideAllSections() {
        const sections = document.querySelectorAll('.tool-section');
        sections.forEach(section => {
            section.classList.add('hidden');
        });
    }
    
    function showSection(sectionId) {
        hideAllSections();
        const section = document.querySelector(sectionId);
        if (section) {
            section.classList.remove('hidden');
        }
    }
    
    function initializePage() {
        hideAllSections(); // Hide all sections initially
        const defaultSectionId = '#marginCalculator'; // Set the ID of the default section you want to show
        showSection(defaultSectionId); // Show the default section
    }
    // Attach event listener to the margin calculator form submission
    const marginForm = document.getElementById('marginForm');
    if (marginForm) {
        marginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            calculateAndDisplayMargin();
        });
    }
    // Attach event listener for the pip calculator form submission
    const pipForm = document.getElementById('pipForm');
    if (pipForm) {
        pipForm.addEventListener('submit', calculateProfit);
    }
    const calculateRiskButton = document.getElementById('calculateForexRisk');
    if (calculateRiskButton) {
        calculateRiskButton.addEventListener('click', calculateForexRisk);
    }

    // Initialize the page
    initializePage();
function calculateAndDisplayMargin() {
    // Retrieve input values
    const accountModel = document.getElementById('accountModel').value;
    const phase = document.getElementById('phase').value;
    const assetType = document.getElementById('assetType').value;
    const currentPairPrice = parseFloat(document.getElementById('currentPairPrice').value);
    const lotSize = parseFloat(document.getElementById('lotSize').value);

    // Calculate margin using the calculateMargin function
    const margin = calculateMargin(accountModel, phase, assetType, currentPairPrice, lotSize);

    // Display the result
    document.getElementById('result').textContent = `${margin.toFixed(2)}`;
    function calculateMargin(accountModel, phase, assetType, currentPairPrice, lotSize) {
        // Define contract sizes
        const contractSizes = {
            'forex': 100000,
            'indices': 10,
            'commodities': 100,  // Default for commodities
            'XAGUSD': 5000       // Exception for XAGUSD
        };
    
        // Get contract size
        let contractSize = contractSizes[assetType];
    
        // Leverage mapping based on account model, phase, and asset type
        const leverageMapping = {
            'Evaluation': {'forex': [100, 100], 'indices': [50, 25], 'commodities': [50, 50]},
            'Express': {'forex': [100, 100], 'indices': [50, 25], 'commodities': [50, 50]},
            'Stellar 1 step': {'forex': [30, 30], 'indices': [5, 5], 'commodities': [10, 10]},
            'Stellar 2 step': {'forex': [100, 100], 'indices': [20, 20], 'commodities': [40, 40]}
        };
        let adjustedAssetType = assetType === 'XAGUSD' ? 'commodities' : assetType;
    
        // Get leverage
        const phaseIndex = phase === 'Challenge Phase' ? 0 : 1;
        let leverage;
        if (leverageMapping[accountModel] && leverageMapping[accountModel][adjustedAssetType]) {
            leverage = leverageMapping[accountModel][adjustedAssetType][phaseIndex];
        } else {
            console.error('Leverage information not found for the given parameters.');
            return; // Handle this situation appropriately
        }
    
        // Calculate margin
        const margin = (contractSize * currentPairPrice * lotSize) / leverage;
        return margin;
    }
}
function calculateProfitLoss(pipDifference, lotSize, instrument) {
    // Define the pip values for different instruments as per the chart provided
  
    // Check if the instrument is in the pip values object
    if (!pipValues[instrument]) {
      return 'Invalid instrument';
    }
     // Calculate the profit or loss
     const pipValue = pipValues[instrument];
     const profitLoss = pipDifference * lotSize * pipValue;
   
     return profitLoss.toFixed(2); // Return the result formatted to two decimal places
   }
   function calculateProfit(event) {
    event.preventDefault();
    const pipDifference = parseFloat(document.getElementById('pips').value);
    const lotSize = parseFloat(document.getElementById('lots').value);
    const instrument = document.getElementById('instrument').value;
    
    if (instrument === "Select Currencies") {
        alert("Please select a currency pair or instrument.");
        return;
    }
    
    const result = calculateProfitLoss(pipDifference, lotSize, instrument);
    document.getElementById('resultValue').textContent = result;
}
function calculateForexRisk() {
    // Use the correct ID for each input specific to the Risk Calculator
    const instrument = document.getElementById('riskInstrument').value; // Ensure the ID is unique
    const accountBalance = parseFloat(document.getElementById('accountBalance').value);
    const riskPercentage = parseFloat(document.getElementById('riskPercentage').value);
    const stopLoss = parseFloat(document.getElementById('stopLoss').value);

    // Check if the instrument is not selected or does not exist in the pipValues
    if (instrument === "Select a pair" || !pipValues.hasOwnProperty(instrument)) {
        alert('Please select a valid instrument.');
        return;
    }

    // Validate the account balance
    if (isNaN(accountBalance) || accountBalance <= 0) {
        alert('Please enter a valid account balance.');
        return;
    }

    // Validate the risk percentage
    if (isNaN(riskPercentage) || riskPercentage <= 0 || riskPercentage > 100) {
        alert('Please enter a valid risk percentage (1-100).');
        return;
    }

    // Validate the stop loss value
    if (isNaN(stopLoss) || stopLoss <= 0) {
        alert('Please enter a valid stop loss value.');
        return;
    }

    // All validations passed, proceed with the calculation
    const pipValue = pipValues[instrument];
    const amountAtRisk = accountBalance * (riskPercentage / 100);
    const positionSize = amountAtRisk / (stopLoss * pipValue);

    // Display the result
    document.getElementById('riskValue').textContent = positionSize.toFixed(2);
}
// Function to calculate and display the pip value
});