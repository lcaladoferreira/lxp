

    //Esta função é usada para converter os dados de imagem que foram salvos no mongoD como um array de binário para uma string base64
    // A string base 64 é necessária para que nosso navegador entenda e exiba a imagem
     function arrayBufferToBase64(buffer) {
        console.log('convertendo para base 64')
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    }    

    function formatDate(string){
        var options = { diaDaSemana: 'long', ano: 'numeric', mes: 'long', dia: 'numeric',  };
        return new Date(string).toLocaleDateString([],options);
    }

 

export default {arrayBufferToBase64, formatDate}


