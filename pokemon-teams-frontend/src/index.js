const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

document.addEventListener('DOMContentLoaded', () => {
    console.log("Dom loaded");

    const main = document.querySelector('main');

    getTrainers(TRAINERS_URL);

    // Adds trainer card HTML
    function getTrainers(url) {
        fetch(url)
        .then(resp => resp.json())
        .then(json => {
            // console.log(json);
    
            for(const trainer in json) {
                const name = json[trainer].name;
                let id = json[trainer].id;
    
                const div = document.createElement('div');
                div.dataset.id = id;
                div.className = "card";
                
                const p = document.createElement('p');
                p.innerText = name;
                div.appendChild(p);
    
                const button = document.createElement('button');
                button.dataset.trainerId = id;
                button.innerText = "Add Pokemon";
                button.addEventListener("click", addPokemon);
                div.appendChild(button);
    
                fetch(`${TRAINERS_URL}/${id}`)
                .then(resp => resp.json())
                .then(json => {
                    
                    const ul = document.createElement('ul');
                    ul.dataset.trainerId = id;

                    for(const pokemon in json) {
                        const nickname = json[pokemon].nickname;
                        const id = json[pokemon].id;

                        const li = document.createElement('li');
                        li.innerText = nickname;
                        
                        const button = document.createElement('button');
                        button.className = "release";
                        button.dataset.pokemonId = id;
                        button.addEventListener("click", removePokemon);
                        li.appendChild(button);

                        ul.appendChild(li);
                    }
                    div.appendChild(ul);
                })
    
                main.appendChild(div);
            }
        });
    }
});

function removePokemon(event) {
    const id = event.target.dataset.pokemonId;

    configObj = {
        method: "DELETE"
    };

    // POST request
    fetch(`${POKEMONS_URL}/${id}`, configObj)
    .then(resp => resp.json())
    .then(json => {
        // console.log(json);
    });
    event.target.parentNode.remove();
}

function addPokemon(event) {
    const trainerId = event.target.dataset.trainerId;
    
    const trainerDiv = document.querySelectorAll(`div[data-trainer-id="${trainerId}"]`);
    const ul = document.querySelector(`ul[data-trainer-id="${trainerId}"]`);
    console.log(ul.children.length);

    const body = {
        trainer_id: trainerId
    }

    const configObj = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(body)
    }

    // POST request
    fetch(`${POKEMONS_URL}`, configObj)
    .then(resp => resp.json())
    .then(json => {
        // console.log(json);
        if (ul.children.length < 7) {
            const nickname = json['nickname'];
            const id = json['id'];

            const li = document.createElement('li');
            li.innerText = nickname;

            const button = document.createElement('button');
            button.className = "release";
            button.dataset.pokemonId = id;
            button.addEventListener("click", removePokemon);
            li.appendChild(button);

            ul.appendChild(li);
        }
    }).catch(error => {
        alert("Party is full!");
        console.log(error.message);
        
    });
}


