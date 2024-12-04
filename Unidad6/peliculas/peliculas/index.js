window.onload = () => {
    const input = document.getElementById("input");
    const buscarPeliculas = document.getElementById("buscarPeliculas");
    const buscarSeries = document.getElementById("buscarSeries");
    const cerrarModal = document.getElementById("cerrarModal");
    const cerrarInforme = document.getElementById("cerrarInforme");
    const crearInforme = document.getElementById("crearInforme");

    let tipoBusqueda = "movie";  
    let pagina = 1;
    let textoBusqueda = "";
    let resultadosTotales = [];

     buscarPeliculas.addEventListener("click", () => {
        tipoBusqueda = "movie";
        document.querySelector(".search-container").classList.remove("hidden");
        realizarBusqueda();
    });

    buscarSeries.addEventListener("click", () => {
        tipoBusqueda = "series";
        document.querySelector(".search-container").classList.remove("hidden");
        realizarBusqueda();
    });

    input.addEventListener("input", () => {
        if (input.value.length >= 3) {
            textoBusqueda = input.value;
            pagina = 1;
            resultadosTotales = [];
            realizarBusqueda();
        }
    });

     cerrarModal.addEventListener("click", () => {
        document.getElementById("detalleModal").classList.add("hidden");
    });

     cerrarInforme.addEventListener("click", () => {
        document.getElementById("informeModal").classList.add("hidden");
    });

     crearInforme.addEventListener("click", generarInforme);



     function realizarBusqueda() {
        const url = `https://www.omdbapi.com/?apikey=35a3c92a&s=${textoBusqueda}&type=${tipoBusqueda}&page=${pagina}`;
        pagina++;

        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                if (data.Search) {
                    const listaPeliculas = document.getElementById("listaPeliculas");
                    data.Search.forEach((item) => {
                        resultadosTotales.push(item);

                        const div = document.createElement("div");
                        div.className = "pelicula";

                        const img = document.createElement("img");
                        img.src = item.Poster !== "N/A" ? item.Poster : "nofoto.avif";
                        img.alt = item.Title;

                    

                        img.addEventListener("click", () => mostrarDetalle(item.imdbID));

                        const titulo = document.createElement("p");
                        titulo.textContent = `${item.Title} (${item.Year})`;

                        div.appendChild(img);
                        
                        div.appendChild(titulo);
                        listaPeliculas.appendChild(div);

                    });

                    document.getElementById("resultados").classList.remove("hidden");
                    crearInforme.classList.remove("hidden");
                    

                     window.addEventListener("scroll", () => {
                        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                            realizarBusqueda();
                            var scroll = true;

                        }
                    });
                   

                }
            });
    }

     function mostrarDetalle(id) {
        const url = `https://www.omdbapi.com/?apikey=35a3c92a&i=${id}`;
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                document.getElementById("tituloDetalle").textContent = data.Title;
                document.getElementById("anioDetalle").textContent = data.Year;
                document.getElementById("directorDetalle").textContent = data.Director;
                document.getElementById("actoresDetalle").textContent = data.Actors;
                
                document.getElementById("sinopsisDetalle").textContent = data.Plot;

                const ratingsContainer = document.getElementById("ratingsDetalle");
                ratingsContainer.innerHTML = "";
                data.Ratings.forEach((rating) => {
                    const p = document.createElement("p");
                    p.textContent = `${rating.Source}: ${rating.Value}`;
                    ratingsContainer.appendChild(p);
                });

                document.getElementById("detalleModal").classList.remove("hidden");
            });
    }

     function generarInforme() {
        const sortedMovies = resultadosTotales.sort((a, b) => b.imdbRating - a.imdbRating).slice(0, 5);

        const canvas = document.getElementById("graficoInforme");
        const ctx = canvas.getContext("2d");

        const labels = sortedMovies.map(movie => movie.Title);
        const data = sortedMovies.map(movie => parseFloat(movie.imdbRating));

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'IMDb Rating',
                    data: data,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        const listaInforme = document.getElementById("listaInforme");
        listaInforme.innerHTML = ""; 
        sortedMovies.forEach(movie => {
            const li = document.createElement("li");
            li.textContent = `${movie.Title} - IMDb Rating: ${movie.imdbRating}`;
            listaInforme.appendChild(li);
        });

        document.getElementById("informeModal").classList.remove("hidden");
    }
};

 // crear un boolean falso fuera del scroll y declararlo dentro del scroll en verdadedro y luego en la funcio n de 
                            // realizar l a busqueda lo volvemos a declarlo en falso
                            // si la altura del documento es mayor que la altura del viewport + la posicion del scroll
                            // entonces es que el scroll esta en la parte inferior del documento
                            // en este caso realizamos la busqueda de nuevo
                            
                            //prefeliblemente quiero que haga una peticion solamente cuando el scroll esta en la parte inferior del documento en vez de 
                            //haga mas peticiones de una
                            //esto se puede hacer con un boolean que se declare en falso y se declare en verd
                            //ado dentro del scroll y luego en la funcion de realizar la busqueda lo volvemos
                            //a declarar en falso
                            //esto se puede hacer con un boolean que se declare en falso y se declare en verdero
                        //Tambien necesito que se arregle la parte de buscar por serie tambien ya que no busca por serie
//                         Una vez tenemos un listado de películas aparecerá la opción de "Crear Informe", donde se mostrará en otra vista:
// Ver por películas más votadas 
// A la vez que se genera el listado anterior se creará una gráfica ciruclar por sectores de     https://www.gstatic.com/charts/loader.js debe de ser de  que represente el dato correspondiente
//OTRa cosa que modificar es que cada vez que se le ahce click en peliculas o series se borre el listado de peliculas o series.