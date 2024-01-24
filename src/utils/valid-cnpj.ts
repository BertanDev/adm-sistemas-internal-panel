export function isValidCNPJ(cnpj: string) {
  // Remover caracteres não numéricos
  cnpj = cnpj.replace(/[^\d]/g, '')

  // Verificar se o CNPJ possui 14 dígitos
  if (cnpj.length !== 14) {
    return false
  }

  // Calcular o primeiro dígito verificador
  let sum = 0
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cnpj[i]) * (i < 4 ? 5 - i : 13 - i)
  }
  const mod = sum % 11
  const digit1 = mod < 2 ? 0 : 11 - mod

  // Verificar o primeiro dígito verificador
  if (parseInt(cnpj[12]) !== digit1) {
    return false
  }

  // Calcular o segundo dígito verificador
  sum = 0
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cnpj[i]) * (i < 5 ? 6 - i : 14 - i)
  }
  const mod2 = sum % 11
  const digit2 = mod2 < 2 ? 0 : 11 - mod2

  // Verificar o segundo dígito verificador
  return parseInt(cnpj[13]) === digit2
}
