import { RegisterType } from "../types/types-index";
import { CustomError } from "../middlewares/errorHandler";
// não usada em nenhum lugar
export async function apiCompare (registerBody: RegisterType) {
  const formatedCnpj = registerBody.CNPJ.replace(/[\.\/-]/g, '');
  const res = await fetch(`https://receitaws.com.br/v1/cnpj/${formatedCnpj}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });
  const data = await res.json();
  let count = 0;
  // cnpj pra testes 46.556.539.0001.22
  /*
    razão: flaviense do brasil madeiras comercial ltda
    nome rep: fabiano de moura correia
    cep: 25.056-070
    municipio: duque de caxias
  */ 
  if (data.status == 'ERROR') throw new CustomError('CNPJ não encontrado', 400, 'BAD_REQUEST');
  if (data.situacao !== 'ATIVO' && data.situacao !== 'ATIVA') throw new CustomError('CNPJ não ativo', 400, 'BAD_REQUEST');
  if (data.cnpj !== registerBody.CNPJ) throw new CustomError('CNPJ fornecido está incorreto', 400, 'BAD_REQUEST');
  if (data.nome.toLowerCase() !== registerBody.razaoSocial.toLowerCase()) throw new CustomError('Razão social fornecido está incorrta', 400, 'BAD_REQUEST');
  if (data.cep !== registerBody.CEP) throw new CustomError('CEP fornecido está incorreto', 400, 'BAD_REQUEST');
  if (data.municipio.toLowerCase() !== registerBody.municipio.toLowerCase()) throw new CustomError('Município fornecido está incorreto', 400, 'BAD_REQUEST');
  if (data.uf !== registerBody.estado) throw new CustomError('Estado fornecido está incorreto', 400, 'BAD_REQUEST');
  for (let i = 0; i < data.qsa.length; i++) {
    const isMatch = data.qsa[i].nome.toLowerCase() == registerBody.nomeRepresentante.toLowerCase() ? true : false;
    
    if (isMatch == true) break;
    count++;
    if (count == data.qsa.length) throw new CustomError('Nome do representante não encontrado nos dados da empresa', 400, 'BAD_REQUEST');
  }
}