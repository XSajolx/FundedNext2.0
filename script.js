document.addEventListener('DOMContentLoaded', function () {
    const pipValues = {
        'AUDCAD': 71500, 'AUDCHF': 119200, 'AUDJPY': 686, 'AUDNZD': 59000,
        'AUDSGD': 77000, 'AUDUSD': 100000, 'CADCHF': 119200, 'CADJPY': 686,
        'CADSGD': 73500, 'CHFJPY': 686, 'EURAUD': 64300, 'EURCAD': 71500,
        'EURCHF': 119200, 'EURGBP': 132900, 'EURHKD': 12800, 'EURHUF': 27800,
        'EURJPY': 686, 'EURNOK': 9600, 'EURNZD': 59000, 'EURSGD': 77000,
        'EURTRY': 3500, 'EURUSD': 100000, 'GBPAUD': 64300, 'GBPCAD': 71500,
        'GBPCHF': 119200, 'GBPJPY': 686, 'GBPNZD': 59000, 'GBPSEK': 73600,
        'GBPSGD': 77000, 'GBPUSD': 100000, 'MXNJPY': 686, 'NOKJPY': 686,
        'NZDCAD': 71500, 'NZDCHF': 119200, 'NZDJPY': 686, 'NZDSGD': 77000,
        'SGDJPY': 686, 'USDCAD': 71500, 'USDCHF': 119200, 'USDCHN': 13900,
        'USDDKK': 15000, 'USDHKD': 12800, 'USDJPY': 686, 'USDMXN': 5200,
        'USDNOK': 9600, 'USDPLN': 24200, 'USDSGD': 77000, 'USDTRY': 35000,
        'USDZAR': 5500, 'ZARJPY': 686, 'NZDUSD': 100000, 'NSDUSD': 100000,
        'USDHUF': 27800, 'USDSEK': 10300,
        // Indices
        'SPX500': 10, 'US30': 10, 'GER30': 11.21, 'US2000': 10.00,
        'UK100': 13.29, 'VIX': 10, 'SWI20': 11.92, 'NTH25': 11.21,
        'NDX100': 10.00, 'JP225': .07, 'HK50': 1.28, 'FRA40': 11.21,
        'EUSTX50': 11.21, 'AUS200': 6.43,'US2000':10.00,
        // Commodities
        'XAUUSD': 100, 'XTIUSD': 1000, 'XAGUSD': 5000, 'USOUSD': 100,
        'UKOUSD': 100,
        // Crypto
        'ADAUSD': 100, 'BCHUSD': 1, 'BTCUSD': 1, 'DOGUSD': 1000, 'ETHUSD': 1,
        'LNKUSD': 100, 'LTCUSD': 1, 'XLMUSD': 100, 'XMRUSD': 1, 'XRPUSD': 100
    };

    $('.select2').select2({
        placeholder: "Select an option",
        allowClear: true
    });

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
        hideAllSections(); 
        const defaultSectionId = '#profitLossCalculator'; 
        showSection(defaultSectionId); 
    }

    const marginForm = document.getElementById('marginForm');
    if (marginForm) {
        marginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            calculateAndDisplayMargin();
        });
    }

    const pipForm = document.getElementById('pipForm');
    if (pipForm) {
        pipForm.addEventListener('submit', function (e) {
            e.preventDefault();
            calculateProfit();
        });
    }

    const calculateRiskButton = document.getElementById('calculateForexRisk');
    if (calculateRiskButton) {
        calculateRiskButton.addEventListener('click', calculateForexRisk);
    }

    initializePage();

    function calculateAndDisplayMargin() {
        const accountModel = document.getElementById('accountModel').value;
        const phase = document.getElementById('phase').value;
        const assetType = document.getElementById('assetType').value;
        const currentPairPrice = parseFloat(document.getElementById('currentPairPrice').value);
        const lotSize = parseFloat(document.getElementById('lotSize').value);

        const margin = calculateMargin(accountModel, phase, assetType, currentPairPrice, lotSize);

        document.getElementById('result').textContent = `${margin.toFixed(2)}`;
    }

    function calculateMargin(accountModel, phase, assetType, currentPairPrice, lotSize) {
        const contractSizes = {
            'forex': 100000,
            'indices': 10,
            'commodities': 100,  
            'XAGUSD': 5000,      
            'BCHUSD/BTCUSD/ETHUSD/LTCUSD/XRPUSD': 1,
            'ADAUSD/LNKUSD/XLMUSD/XRPUSD': 100,
            'ADAUSD': 100,
            'LNKUSD': 100,
            'XLMUSD': 100,
            'XRPUSD': 100,
            'BCHUSD': 1,
            'BTCUSD': 1,
            'ETHUSD': 1,
            'LTCUSD': 1,
            'DOGUSD': 1000
        };

        let contractSize = contractSizes[assetType];

        const leverageMapping = {
            'Evaluation': {'forex': [100, 100], 'indices': [15, 15], 'commodities': [25, 25], 'crypto': [1, 1]},
            'Express': {'forex': [100, 100], 'indices': [15, 15], 'commodities': [25, 25], 'crypto': [1, 1]},
            'Stellar 1 step': {'forex': [30, 30], 'indices': [5, 5], 'commodities': [10, 10], 'crypto': [1, 1]},
            'Stellar 2 step': {'forex': [100, 100], 'indices': [15, 15], 'commodities': [25, 25], 'crypto': [1, 1]},
            'Stellar Lite': {'forex': [100, 100], 'indices': [15, 15], 'commodities': [25, 25], 'crypto': [1, 1]}
        };

        let adjustedAssetType;

        if (assetType === 'XAGUSD') {
            adjustedAssetType = 'commodities';
        } else {
            const cryptoSymbols = ['BCHUSD', 'BTCUSD', 'ETHUSD', 'LTCUSD', 'XRPUSD', 'ADAUSD', 'LNKUSD', 'XLMUSD', 'DOGUSD'];
            const assetTypes = assetType.split('/');
            if (assetTypes.some(type => cryptoSymbols.includes(type))) {
                adjustedAssetType = 'crypto';
            } else {
                adjustedAssetType = assetType;
            }
        }

        const phaseIndex = phase === 'Challenge Phase' ? 0 : 1;
        let leverage;
        if (leverageMapping[accountModel] && leverageMapping[accountModel][adjustedAssetType]) {
            leverage = leverageMapping[accountModel][adjustedAssetType][phaseIndex];
        } else {
            console.error('Leverage information not found for the given parameters.');
            return;
        }

        const margin = (contractSize * currentPairPrice * lotSize) / leverage;
        return margin;
    }

    function calculateProfit() {
        const Price1 = parseFloat(document.getElementById('Price1').value);
        const Price2 = parseFloat(document.getElementById('Price2').value);
        const lotSize = parseFloat(document.getElementById('lots').value);
        const instrument = document.getElementById('instrument').value;
        const tradeType = document.getElementById('tradeType').value;

        if (instrument === "Select Currencies") {
            alert("Please select a currency pair or instrument.");
            return;
        }

       const pipDifference = (Price1 - Price2);
        let profitLoss;

            if (tradeType === "buy") {
                profitLoss = pipDifference >= 0 ? "Loss" : "Profit";
            } else if (tradeType === "sell") {
                profitLoss = pipDifference >= 0 ? "Profit" : "Loss";
            }
            const result = calculateProfitLoss(Math.abs(pipDifference), lotSize, instrument);
            document.getElementById('resultValue').textContent = `${profitLoss}: $${result}`;
        }

        function calculateProfitLoss(pipDifference, lotSize, instrument) {
            if (!pipValues[instrument]) {
                return 'Invalid instrument';
            }

            const pipValue = pipValues[instrument];
            const profitLoss = pipDifference * lotSize * pipValue;

            return profitLoss.toFixed(2);
        }

        function calculateForexRisk() {
            const instrument = $('#riskInstrument').val();
            const accountBalance = parseFloat($('#accountBalance').val());
            const riskPercentage = parseFloat($('#riskPercentage').val());
            const entryPrice = parseFloat($('#entryPrice').val());
            const exitPrice = parseFloat($('#exitPrice').val());

            if (instrument === "Select a pair" || !pipValues.hasOwnProperty(instrument)) {
                alert('Please select a valid instrument.');
                return;
            }

            if (isNaN(accountBalance) || accountBalance <= 0) {
                alert('Please enter a valid account balance.');
                return;
            }

            if (isNaN(riskPercentage) || riskPercentage <= 0 || riskPercentage > 100) {
                alert('Please enter a valid risk percentage (1-100).');
                return;
            }

            if (isNaN(entryPrice) || isNaN(exitPrice)) {
                alert('Please enter valid entry and exit prices.');
                return;
            }

            const pipDifference = Math.abs(exitPrice - entryPrice);
            const pipValue = pipDifference * pipValues[instrument];
            const amountAtRisk = accountBalance * (riskPercentage / 100);
            const positionSize = amountAtRisk / pipValue;

            $('#riskValue').text(positionSize.toFixed(2));
            $(document).ready(function() {
                // Initialize Select2 for all select elements with the class 'select2'
                $('.select2').select2();
    
                // Add your other custom JavaScript here
            });
        }
});
