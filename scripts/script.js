async function converter() {
  //puxando valores dos inputs e armazenando em variáveis
  const valor = parseFloat(document.getElementById('valor').value);
  const moedaDe = document.getElementById('moedaDe').value;
  const moedaPara = document.getElementById('moedaPara').value;
  
  //verificando se ele é um número e se o valor é maior ou igual a 0. caso seja, não irá converter
  if (isNaN(valor) || valor <= 0) {
    document.getElementById('resultado').innerText = "Digite um valor válido.";
    return;
  }
  //variáveis com links da API
  const url = `https://api.exchangerate-api.com/v4/latest/${moedaDe}`;
  const urlPara = `https://api.exchangerate-api.com/v4/latest/${moedaPara}`

try {
  //fazendo requisições para a API e armazenando os dados necessários pra conversão
  const resposta = await fetch(url);
  const respostaPara = await fetch(urlPara);
  const dados = await resposta.json();
  const dadosPara = await respostaPara.json()
  const taxa = dados.rates[moedaPara];
  const taxaPara = dadosPara.rates[moedaDe];
  //puxando o dado da data da cotação e formatando a data
  const dataDaCotacao = dados.date
  const partesData = dataDaCotacao.split('-'); 
  const dataFormatada = `${partesData[2]}/${partesData[1]}/${partesData[0]}`;

  //formatando o valor da moeda de origem
  const valorDe = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: `${moedaDe}`,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor);
  //formatando o valor da moeda de destino e convertendo-a
  const valorPara = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: `${moedaPara}`,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor * taxa);

  //puxando os textos do item selecionado do "select"
  const selectMoedaDe = document.getElementById('moedaDe');
  const textoMoedaDe = selectMoedaDe.options[selectMoedaDe.selectedIndex].text;
  const selectMoedaPara = document.getElementById('moedaPara');
  const textoMoedaPara = selectMoedaPara.options[selectMoedaPara.selectedIndex].text;

  //inserindo os valores no corpo do HTMl
  document.getElementById('conversaoDe').innerText = `Conversão de: ${textoMoedaDe}`;
  document.getElementById('conversaoDoValorDe').innerText =  `Valor a converter: ${valorDe}`;
  document.getElementById('conversaoPara').innerText =  `Para: ${textoMoedaPara}`;
  document.getElementById('conversaoDoValorPara').innerText =  `Valor convertido: ${valorPara}`;
  document.getElementById('conversaoDataDeCotacao').innerText =  `Data da cotação utilizada: ${dataFormatada}`;
  document.getElementById('taxaDe').innerText =  `1 ${textoMoedaDe} = ${1 * taxa} ${textoMoedaPara}`;
  document.getElementById('taxaPara').innerText =  `1 ${textoMoedaPara} = ${1 * taxaPara} ${textoMoedaDe}`;
  adicionarLinha(moedaDe, valorDe, moedaPara, valorPara);
  //caso encontre algum erro, vai dar erro ué
  } catch (erro) {
    document.getElementById('erro').innerText = "Erro ao buscar a cotação.";
  }

  
}

function adicionarLinha(moedaDe, valor, moedaPara, valorConvertido) {
  //criando um objeto de data e hora
  const agora = new Date();

  //pegando os valores desse objeto
  const dia = String(agora.getDate()).padStart(2, '0');           
  const mes = String(agora.getMonth() + 1).padStart(2, '0');       
  const ano = agora.getFullYear();

  const horas = String(agora.getHours()).padStart(2, '0');
  const minutos = String(agora.getMinutes()).padStart(2, '0');

  //formatando em data e hora
  const dataEHora = `${dia}/${mes}/${ano} ${horas}:${minutos}`;

  // pegando a tabela
  var tabela = document.getElementById('tabelaHistorico').getElementsByTagName('tbody')[0];
  // variável para inserir linhas
  var novaLinha = tabela.insertRow();

  //criando a linha
  var celulaMoedaDe = novaLinha.insertCell(0);
  var celulaValor = novaLinha.insertCell(1);
  var celulaMoedaPara = novaLinha.insertCell(2);
  var celulaValorConvertido = novaLinha.insertCell(3);
  var celulaDataEHora = novaLinha.insertCell(4);

  // adicionando as células
  celulaMoedaDe.textContent = moedaDe;
  celulaValor.textContent = valor;
  celulaMoedaPara.textContent = moedaPara;
  celulaValorConvertido.textContent = valorConvertido;
  celulaDataEHora.textContent = dataEHora;
}


//faz o revesamento da moeda de origem para moeda de destino, trocando de posição
document.getElementById('trocar').addEventListener('click', function() {
  const moedaDe = document.getElementById('moedaDe');
  const moedaPara = document.getElementById('moedaPara');
  const valorMoedaDe = moedaDe.value;
  const valorMoedaPara = moedaPara.value;
  
  moedaDe.value = valorMoedaPara;
  moedaPara.value = valorMoedaDe;
  converter()
});

//copiar o valor convertido
document.getElementById('copiarConversao').addEventListener('click', function() {
  var textoComValor = document.getElementById("conversaoDoValorPara").innerText;
  //divide o texto em partes
  var partes = textoComValor.split(": ");
  var valorConvertido = partes[1];  // "$ -,--"
  navigator.clipboard.writeText(valorConvertido)
});

converter()