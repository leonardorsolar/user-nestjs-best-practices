document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('userForm');
  const mensagem = document.getElementById('mensagem');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const user = {
        name: formData.get('name'),
        email: formData.get('email'),
      };

      try {
        const res = await fetch('/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user),
        });

        if (!res.ok) throw new Error('Erro ao cadastrar');

        mensagem.textContent = 'Usuário cadastrado com sucesso!';
        form.reset();
      } catch (err) {
        mensagem.textContent = 'Erro ao cadastrar usuário.';
      }
    });
  }
});
