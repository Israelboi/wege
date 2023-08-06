let selectedRange = "1d"; // Valor padrão para o intervalo
let stockChart; // Variável para armazenar a referência do gráfico

async function fetchData() {
  try {
    const response = await fetch(`https://brapi.dev/api/quote/WEGE3%2C%5EBVSP?range=${selectedRange}&interval=1h&fundamental=false&dividends=false`);
    const jsonData = await response.json();

    const wegeData = jsonData.results.find(item => item.symbol === 'WEGE3');
    const bvspData = jsonData.results.find(item => item.symbol === '^BVSP');

    if (wegeData) {
      document.getElementById('companyName').textContent = wegeData.longName;
      document.getElementById('symbol').textContent = wegeData.symbol;
      document.getElementById('stockPrice').textContent = wegeData.regularMarketPrice.toFixed(2);
     // document.getElementById('stockChange').textContent = (wegeData.regularMarketChangePercent * 100).toFixed(2) + '%';
      //document.getElementById('indexValue').textContent = bvspData.regularMarketPrice.toFixed(2);
      //document.getElementById('marketCap').textContent = (wegeData.marketCap / 1000000000).toFixed(2) + 'B';
      //document.getElementById('volume').textContent = wegeData.regularMarketVolume.toLocaleString();
      //document.getElementById('weekRange').textContent = wegeData.fiftyTwoWeekRange;
      document.getElementById('companyLogo').src = wegeData.logourl;

      const historicalData = wegeData.historicalDataPrice.map(item => ({
        date: new Date(item.date * 1000),
        price: item.close
      }));

      // Limpa o gráfico atual antes de atualizar com os novos dados
      if (stockChart) {
        stockChart.destroy();
      }

      stockChart = new Chart(document.getElementById('stockChart'), {
        type: 'line',
        data: {
          labels: historicalData.map(item => item.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
          datasets: [{
            label: 'Preço da ação',
            data: historicalData.map(item => item.price),
            borderColor: '#007BFF',
            fill: false,
            tension: 0.2
          }]
        },
        options: {
          scales: {
            x: {
              ticks: {
                maxTicksLimit: 5
              }
            }
          }
        }
      });
    }
  } catch (error) {
    console.error('Erro ao obter os dados da API:', error);
  }
}

document.getElementById('rangeSelect').addEventListener('change', (event) => {
  selectedRange = event.target.value;
  fetchData(); // Chama fetchData() sempre que uma nova opção é selecionada
});

// Chama a função fetchData() na primeira carga da página
fetchData();
