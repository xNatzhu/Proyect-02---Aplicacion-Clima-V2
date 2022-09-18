
window.addEventListener("load", () => {
    //Variables
    let temperaturaGrado = document.getElementById("section_one_column_grado");
    let ciudad = document.getElementById("ciudad");
    let map = document.getElementById("map");
    let fecha = document.getElementById("fecha");
    let humedad = document.getElementById("humedad");
    let presionAtmosferica = document.getElementById(`presionAtmosferica`);
    let vientoSpeed = document.getElementById("vientoSpeed");
    let temperaturaMax = document.getElementById("temperaturaMax");
    let temperaturaMin = document.getElementById("temperaturaMin");
    let getMapLat = document.getElementById("mapLat");
    let getMapLon = document.getElementById("mapLon");
    let cityForm 
    let searchForm = document.getElementById("searchForm");

    //Funciones

    //Funcion - fecha
    function fechaContent() {
        setInterval(() => {
        //Variables dias
        let weekDays  = ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        //Variable fecha
        let dateClassCreation = new Date();
        let executionOfDays = dateClassCreation.getDay()
        fecha.innerHTML = weekDays[executionOfDays];

        //Variable de contador
        let countDays = 0

        for (let index = 0; index < 3; index++) {
            countDays +=1
            let forecastDay = document.getElementById('forecastDay0'+countDays);
            var daysFilter= ((executionOfDays+=1) > 6) ? weekDays[executionOfDays = 0] : weekDays[executionOfDays];
            forecastDay.innerHTML = daysFilter

        }
            
        }, 1000);
    }

    fechaContent()

    const getTemperature = (main) => {
        const maxTemp = Math.round(main.temp_max)
        const minTemp = Math.round(main.temp_min)

        return {maxTemp, minTemp};
    }

    //Funcion - proceso del clima

    function clima(data) {
        cityForm = data.city.name
        console.log(data);
        let temperaturaGradoValor = Math.round(data.list[0].main.temp);
        temperaturaGrado.innerHTML = `${temperaturaGradoValor}°`
        ciudad.innerText = data.city.name
        let mapLon = data.city.coord.lon
        let mapLat = data.city.coord.lat
        getMapLat.innerHTML = mapLat;
        getMapLon.innerHTML = mapLon;

        let selector = document.getElementById('section-two-column-two');
        let iframe = document.createElement('iframe');
        //propiedades iframe
        iframe.setAttribute('src',`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d13618.049739807708!2d${mapLon}!3d${mapLat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2sar!4v1662869534399!5m2!1ses!2sar" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade`);
        selector.appendChild(iframe);
        let {humidity, pressure} = data.list[0].main
        humedad.innerHTML = `${humidity}%`
        presionAtmosferica.innerHTML = `${pressure} hPa`
        vientoSpeed.innerHTML = `${data.list[0].wind.speed} km/h`

        const {maxTemp, minTemp} = getTemperature(data.list[0].main);
        temperaturaMax.innerHTML = `${maxTemp}°`
        temperaturaMin.innerHTML = `${minTemp}°`

        const icon = data.list[0].weather[0].icon
        iconoClima.src = `assets/animated/${icon}.svg`;

        console.log(iconoClima);
        let countIndex = 0
        //Bucle extended weather
        for (let index = 1; index < 6; index++) {
            countIndex += 1
            let tempExtendedWeather = document.getElementById('extendedWeather0'+countIndex);
            tempExtendedWeather.innerHTML = Math.round(data.list[countIndex].main.temp)+"°"
            const ExtendedWeatherIco = data.list[countIndex].weather[0].icon
            document.getElementById("iconoClima0"+countIndex).src = `assets/animated/${ExtendedWeatherIco}.svg`;
            let forecastDescriptionExtended= document.getElementById('forecastDescriptionExtended0'+countIndex);
            forecastDescriptionExtended.innerText = data.list[countIndex].weather[0].main
            
        }
    }


    

    function getClima(posicion) {
        const {longitude, latitude} = posicion;
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=6752644c4b10d307e40b484055d4f5a5&units=metric`
        fetch(url)
            .then(response => {return response.json()})
            .then(data => {
                clima(data)
            })
            .catch(error => {
                console.log(error)
            })

        console.log(url);
    }

    async function getLocationDefault() {
        const request = await fetch("https://ipinfo.io/json?token=90d44b45827c47")
        const jsonResponse = await request.json()
        const loc = jsonResponse.loc.split(',');
        const coords = {
            latitude: loc[0],
            longitude: loc[1]
        };
        getClima(coords);
        return coords;
    }

    function init() {
        navigator.geolocation.getCurrentPosition(posicion => {
            getClima(posicion.coords)
        }, error => {
            getLocationDefault()
        })
    }

    init()

    function searchFunction(params) {
        //handler 
    
        //CONFIGURACION FORM
        params.preventDefault()
        let element  = document.getElementById("section-two-column-two");
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        let contentCity = params.target.nameData.value
        let expReg= new RegExp("[,.;+-1234567890*]","g");
        cityForm = contentCity.replace(expReg, "");
        console.log(cityForm);
        //API

        const URLAPICITY = `https://api.openweathermap.org/data/2.5/forecast?q=${cityForm}&APPID=6752644c4b10d307e40b484055d4f5a5&units=metric`

        fetch(URLAPICITY)
            .then(response=>{return response.json()})
            .then(data=>{
                clima(data)})
                .catch(error=>{
                  console.log(error)
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'La ciudad colocada no existe... ¡Porfavor inténtelo nuevamente!',
                    background: "#000000ea",
                    color:"#fff",
                    confirmButtonColor: "#161616",
                    width:"40%",
                  })
                })

                console.log(URLAPICITY);
    }
    
    //Event
    
    searchForm.addEventListener("submit", searchFunction)

})