export class GithubUser {
    static search(username) {
        const endpoint = `https://api.github.com/users/${username}`

        return fetch(endpoint).then(data => data.json()).then(({ login, name, public_repos, followers }) => ({
            login,
            name,
            public_repos,
            followers
        }))
    }
}


// classe da logica/estruturaçao dos dados
export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
    }
    

    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    }

    save() {
        localStorage.setItem('@github-favorites', JSON.stringify(this.entries))
    }

    async add(username) {
        try {

            const userExists = this.entries.find(entry => entry.login ===username)

            if(userExists) {
                throw new Error('usuário já cadastrado')
            }


            const user = await GithubUser.search(username)

            if(user.login === undefined) {
                throw new Error('Usuário não encontrado')
            }

            this.entries = [user, ...this.entries]
            this.update()
            this.save()

        } catch(error) {
            alert (error.message)
        }
    }

    delete(user) {
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

        this.entries = filteredEntries
        this.update()
        this.save()
    }
}

// vizualizaçao e eventos do html

export class Favoritesview extends Favorites {
    constructor(root) {
        super(root)
        
        this.tbody = this.root.querySelector('tbody')

        this.update()
        this.addFav()
//        this.hoverSwitch()
    }

    addFav() {
        const addBtn = this.root.querySelector('#inputs button')
        addBtn.onclick = () => {
            const { value } = this.root.querySelector('#inputs input')
            this.add(value)
        }

        

    }

//    hoverSwitch() {
//        const btn = this.root.querySelector('#inputs button')

//        btn.onmouseover = () => {
//            const star = this.root.querySelector('#star');
//            const starHolder = this.root.querySelector('#star-holder');
//            star.classlist.add('hide');
//            starHolder.classlist.remove('hide');

//        }

//    }

    update() {
        this.removeAllTr()
       

        this.entries.forEach( user => {
            const row = this.createRow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `imagem de ${user.name}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user span').textContent = `/${user.login}`
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            row.querySelector('.remove').onclick = () => {
                const isOk = confirm('tem certeza que queres apagar esta linha?')
                if(isOk) {
                    this.delete(user)
                }
            }

            this.tbody.append(row)
        })
    }
    
    createRow() {
        const tr = document.createElement('tr')

        const content = `
  
        <td class="user">
            <img src="https://github.com/maykbrito.png" alt="imagem do perfil">
            <a href="https://github.com/maykbrito">
                <p>Mayk Brito</p>
                <span>/maykbrito</span>
            </a>
        </td>
        <td class="repositories">
            47
        </td>
        <td class="followers">
            50000
        </td>
        <td>
            <p class="remove">remover</p>
        </td>

        `

        tr.innerHTML = content

        return tr
    }
    
    removeAllTr() {

    
        this.tbody.querySelectorAll('tr').forEach((tr) => {
            tr.remove()
        });

    }
}