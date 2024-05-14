const ctx = document.getElementById('myChart');//Contenedor "canvas" para pintar la gráfica

//Constrcción de la gráfica (se crea un nuevo objeto Chart, y se le indica la data)
new Chart(ctx, {
type: 'bar',
data: {
    labels: ['Create', 'Update', 'Delete'],
    datasets: [{
    label: ['# de request'],
    data: [10,3,1],
    backgroundColor:['rgb(114, 58, 235)','rgb(114, 58, 235)','rgb(114, 58, 235)'],
    borderWidth: 1
    }],
},
options: {
    scales: {
    y: {
        beginAtZero: true
    }
    }
}
});