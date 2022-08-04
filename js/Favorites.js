import { GithubUser } from "./githubUser.js"
//classe que vai conter a logica dos dados
// como os dados serão estruturados
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
    
  }


  async add(username) {
    try {

      const userExists = this.entries.find(entry => entry.login === username)

      if (userExists) {
        throw new Error(`${username} já está na lista! 😉`)
      }

      const User = await GithubUser.search(username)

      if (User.login === undefined) {
        throw new Error('Usuário não encontrado! 😥')
      }

      this.entries = [User, ...this.entries]
      this.update()
      this.save()

    } catch (error) {
      alert(error.message)
    }
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem
      ('@github-favorites:')) || []
  }

  delete(user) {
    const filteredEntries = this.entries.filter(entry =>
      entry.login !== user.login)

    this.entries = filteredEntries
    this.update()
    this.save()
  }
}

//classe que vai criar a visualização e eventos do HTML
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)
    this.tbody = this.root.querySelector('table tbody')
    this.update()
    this.onadd()
  }
  onadd() {
    const addButton = this.root.querySelector('.search button')
    addButton.onclick = () => {
      const { value } = this.root.querySelector('.search input')

      this.add(value)
    }
  }

  update() {
    this.removeAllTr()

    this.entries.forEach(user => {
      const row = this.creatRow()
      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = `${user.name}`
      row.querySelector('.user span').textContent = `/${user.login}`
      row.querySelector('.repositories').textContent = `${user.public_repos}`
      row.querySelector('.follwers ').textContent = `${user.followers}`

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm(`Tem certeza que deseja deletar ${user.login} do favorito?`)
        if (isOk) {
          this.delete(user)
        }
      }

      this.tbody.append(row)
    })
  }

  creatRow() {
    const tr = document.createElement('tr')
    tr.innerHTML = `
      <td class="user">
        <img src="https://github.com/Tielson.png" alt="Imagem de Filipe Tielson">
        <a href="https://github.com/Tielson" target="_blank">
          <p>Filipe Tielson</p>
          <span>/filipetielson</span>
        </a>
      </td>
      <td class="repositories">
        15 
      </td>
      <td class="follwers">
        19   
      </td>
      <td>
        <button class="remove">Remove</button>
      </td>
`
    return tr
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr')
      .forEach((tr) => {
        tr.remove()
      })
      this.clean()
  }

  clean(){
    const tableBorder = this.root.querySelector('.table-border tbody')
    
        if (this.entries.length === 0) {
      tableBorder.classList.add('clean-table')
    } else {
      tableBorder.classList.remove('clean-table')
    }
    


  }
}
