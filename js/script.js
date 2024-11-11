document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://nd9ii0rkr8.execute-api..amazonaws.com/prod/api/v1/invoice';

    window.uploadFile = async function() {
        const fileInput = document.getElementById('fileInput');
        const resultDiv = document.getElementById('result');

        resultDiv.innerHTML = ''; 

        if (!fileInput.files.length) {
            resultDiv.innerHTML = '<span class="error">Por favor, selecione um arquivo!</span>';
            return;
        }

        const file = fileInput.files[0];

        resultDiv.innerHTML = '<span class="loading">Carregando...</span>';

        try {
            const base64Content = await readFileAsBase64(file);

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'file-name': file.name
                },
                body: JSON.stringify({ body: base64Content })
            });

            const data = await response.json();

            if (response.ok) {
                resultDiv.innerHTML = `
                    <h3 class="invoice-title">Detalhes da Nota Fiscal</h3>
                    <p><span class="success">Status: ${response.status} - Sucesso!</span></p>
                    <table class="invoice-table">
                        <tbody>
                            <tr><td>Nome Emissor</td><td>${data.nome_emissor || "None"}</td></tr>
                            <tr><td>CNPJ Emissor</td><td>${data.CNPJ_emissor || "None"}</td></tr>
                            <tr><td>Endereço Emissor</td><td>${data.endereco_emissor || "None"}</td></tr>
                            <tr><td>CNPJ/CPF Consumidor</td><td>${data.CNPJ_CPF_consumidor || "None"}</td></tr>
                            <tr><td>Data de Emissão</td><td>${data.data_emissao || "None"}</td></tr>
                            <tr><td>Número da Nota Fiscal</td><td>${data.numero_nota_fiscal || "None"}</td></tr>
                            <tr><td>Série da Nota Fiscal</td><td>${data.serie_nota_fiscal || "None"}</td></tr>
                            <tr><td>Valor Total</td><td>${data.valor_total || "None"}</td></tr>
                            <tr><td>Forma de Pagamento</td><td>${data.forma_pgto || "None"}</td></tr>
                            <tr><td>Nome do Arquivo</td><td>${data.arquivo_location || "None"}</td></tr>
                        </tbody>
                    </table>
                    <button class="btn-clear" onclick="clearResult()">Apagar Resultado</button> <!-- Botão de apagar -->
                `;
            } else {
                resultDiv.innerHTML = `
                    <span class="error">Erro no upload: ${response.status}</span>
                    <pre>${JSON.stringify(data, null, 2)}</pre>
                `;
            }
        } catch (error) {
            resultDiv.innerHTML = `<span class="error">Erro: ${error.message}</span>`;
        }
    };

    function readFileAsBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64Content = reader.result.split(',')[1];
                resolve(base64Content);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    window.clearResult = function() {
        document.getElementById('result').innerHTML = '';
    };
});


