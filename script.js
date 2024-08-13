document.addEventListener('DOMContentLoaded', function () {
    const pipValues = {
        'AUDCAD': 72400, 'AUDCHF': 110900, 'AUDJPY': 659, 'AUDNZD': 58900,
        'AUDSGD': 73500, 'AUDUSD': 100000, 'CADCHF': 110900, 'CADJPY': 659,
        'CADSGD': 73500, 'CHFJPY': 659, 'EURAUD': 63800, 'EURCAD': 72400,
        'EURCHF': 110900, 'EURGBP': 122500, 'EURHKD': 12800, 'EURHUF': 28400,
        'EURJPY': 661, 'EURNOK': 9000, 'EURNZD': 59000, 'EURSGD': 73600,
        'EURTRY': 3500, 'EURUSD': 100000, 'GBPAUD': 63600, 'GBPCAD': 72300,
        'GBPCHF': 110900, 'GBPJPY': 661, 'GBPNZD': 59000, 'GBPSEK': 73600,
        'GBPSGD': 73600, 'GBPUSD': 100000, 'MXNJPY': 661, 'NOKJPY': 660,
        'NZDCAD': 72300, 'NZDCHF': 110900, 'NZDJPY': 661, 'NZDSGD': 73600,
        'SGDJPY': 661, 'USDCAD': 72300, 'USDCHF': 110900, 'USDCHN': 13700,
        'USDDKK': 14300, 'USDHKD': 12800, 'USDJPY': 661, 'USDMXN': 5600,
        'USDNOK': 9000, 'USDPLN': 24200, 'USDSGD': 73600, 'USDTRY': 35000,
        'USDZAR': 5300, 'ZARJPY': 661, 'NZDUSD': 100000,
        // Indices
        'SPX500': 1000, 'US30': 1000, 'GER30': 1067, 'US2000': 1000,
        'UK100': 1220, 'VIX': 1000, 'SWI20': 1108, 'NTH25': 2134,
        'NDX100': 1000, 'JP225': 70, 'HK50': 128, 'FRA40': 1067,
        'EUSTX50': 1067, 'AUS200': 6350,'US2000':1000,
        // Commodities
        'XAUUSD': 100, 'XTIUSD': 1000, 'XAGUSD': 5000, 'USOUSD': 100,
        'UKOUSD': 100,
        // Crypto
        'ADAUSD': 100, 'BCHUSD': 1, 'BTCUSD': 10, 'DOGUSD': 1000, 'ETHUSD': 1,
        'LNKUSD': 100, 'LTCUSD': 1, 'XLMUSD': 100, 'XMRUSD': 1, 'XRPUSD': 1000
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
            'Evaluation': {'forex': [100, 100], 'indices': [50, 25], 'commodities': [50, 50], 'crypto': [2, 2]},
            'Express': {'forex': [100, 100], 'indices': [50, 25], 'commodities': [50, 50], 'crypto': [2, 2]},
            'Stellar 1 step': {'forex': [30, 30], 'indices': [5, 5], 'commodities': [10, 10], 'crypto': [2, 2]},
            'Stellar 2 step': {'forex': [100, 100], 'indices': [20, 20], 'commodities': [40, 40], 'crypto': [2, 2]},
            'Stellar Lite': {'forex': [100, 100], 'indices': [15, 15], 'commodities': [25, 25], 'crypto': [2, 2]}
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
