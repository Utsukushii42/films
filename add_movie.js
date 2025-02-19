$(document).ready(function() {
    $('#movie-form').on('submit', function(e) {
        e.preventDefault();  


        const nom = $('#nom').val();
        const dateDeSortie = $('#dateDeSortie').val();
        const realisateur = $('#realisateur').val();
        const note = $('#note').val() || null;  
        const notePublic = $('#notePublic').val() || null;
        const compagnie = $('#compagnie').val();
        const description = $('#description').val();
        const origine = $('#origine').val();
        const lienImage = `img/${$('#lienImage').val()}`;

        const movieData = {
            nom,
            dateDeSortie,
            realisateur,
            note,
            notePublic,
            compagnie,
            description,
            origine,
            lienImage
        };

        $.ajax({
            url: 'http://localhost:3000/movies',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(movieData),
            success: function(response) {
                alert('Film ajouté !');
                $('#movie-form')[0].reset();
                loadMovies('all');
                
            },
            error: function(xhr, status, error) {
                alert("Erreur d'ajout du film");
            }
        });
    });
});

