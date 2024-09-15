export default function Home() {
  return (
    <>
      <div className="text-center mt-5">
        <h2>Sistema de Compras</h2>
        <p>Bem-vindo ao sistema de compras!</p>
      </div>

      <h3>Funcionalidades já implementadas</h3>

      <h6>Autenticação com e-mail e senha</h6>
      <h6>Cadastro de fornecedores</h6>
      <h6>Cadastro de contatos</h6>
      <h6>Cadastro de produtos</h6>
      <h6>Acesso de administrador e usuário</h6>
      <h6>Cadastro de usuários (controle bloqueado/admin)</h6>
      <h6>Cadastro de cotações</h6>

      <h3>Problemas conhecidos</h3>

      <h6>As consultas sempre retornam todos os registros, oque pode escalar mal em um ambiente de produção</h6>
      <h6>Por ex: ao excluir um fornecedor, teria q excluir todos os contatos relacionados. Porque senão vai ficar inconsistente</h6>
      <h6>Filtrar as amarraçoes de fornecedor e contato para somente ativos</h6>
      <h6>Ajustar valores das quantidades em uma solicitação de compra baseada na unidade de medida do produto</h6>
    </>
  );
}
