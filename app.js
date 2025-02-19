$(document).ready(function() {
    function loadMovies(niveau, noteMin, noteMax, origineFilm) {
        $('#movies-container').empty();
    
        const data = { niveau, origine: origineFilm };
        if (noteMin) data.noteMin = noteMin;
        if (noteMax) data.noteMax = noteMax;
    
        $.ajax({
            url: 'http://localhost:3000/movies',
            type: 'GET',
            dataType: 'json',
            data: data,
            success: function(moviesData) {
                const container = $('#movies-container');
    
                $.each(moviesData, function(i, movie) {
                    let templateId = 'movie-template';
                    if (niveau === 'Banger') templateId = 'banger';
                    if (niveau === 'Navet') templateId = 'navets';
    
                    const template = document.getElementById(templateId);
                    const instance = document.importNode(template.content, true);
    
                    $(instance).find('.nom').text(movie.nom);
                    $(instance).find('.dateDeSortie').text(movie.dateDeSortie);
                    $(instance).find('.realisateur').text(movie.realisateur);
                    $(instance).find('.note').text(movie.note);
                    $(instance).find('.notePublic').text(movie.notePublic || 'N/A');
                    $(instance).find('.compagnie').text(movie.compagnie);
                    $(instance).find('.description').text(movie.description);
                    $(instance).find('.lienImage').attr('src', movie.lienImage);
    
                    if (movie.notePublic > 0) {
                        const difference = Math.abs(movie.note - movie.notePublic).toFixed(1);
                        $(instance).find('.noteDifference').text(difference);
                    } else {
                        $(instance).find('.noteDifference').text('Note public indisponible');
                    }
    
                    // Set the data-id attribute for the delete and edit buttons
                    $(instance).find('.delete-button').attr('data-id', movie.id);
                    $(instance).find('.edit-button').attr('data-id', movie.id);
    
                    $(instance).find('.delete-button').on('click', function() {
                        deleteMovie(movie.id, instance);
                    });
    
                    container.append(instance);
                });
            },
            error: function(xhr, status, error) {
                console.error("Erreur " + error);
            }
        });
    }

    function deleteMovie(id, instance) {
        $.ajax({
            url: `http://localhost:3000/movies/${id}`,
            type: 'DELETE',
            success: function(response) {
                alert(response.message);
                $(instance).remove();
            },
            error: function(xhr, status, error) {
                alert("Erreur lors de la suppression du film");
            }
        });
    }

    $(document).on("click", ".edit-button", function () {
        const movieElement = $(this).closest(".movie-card");
        const movieId = $(this).attr('data-id'); // Get the data-id attribute from the edit button
    
        $('#edit-movie-id').val(movieId);
        $('#edit-nom').val(movieElement.find('.nom').text());
        $('#edit-dateDeSortie').val(movieElement.find('.dateDeSortie').text());
        $('#edit-realisateur').val(movieElement.find('.realisateur').text());
        $('#edit-note').val(movieElement.find('.note').text());
        $('#edit-notePublic').val(movieElement.find('.notePublic').text());
        $('#edit-compagnie').val(movieElement.find('.compagnie').text());
        $('#edit-description').val(movieElement.find('.description').text());
        $('#edit-lienImage').val(movieElement.find('.lienImage').attr('src'));
        $('#edit-origine').val(movieElement.find('.origine').text());
    
        $('#edit-movie-form').show();
    });

    $('#edit-form').submit(function (event) {
        event.preventDefault();
    
        const movieId = $('#edit-movie-id').val();
        const formData = {
            nom: $('#edit-nom').val(),
            realisateur: $('#edit-realisateur').val(),
            compagnie: $('#edit-compagnie').val(),
            dateDeSortie: $('#edit-dateDeSortie').val(),
            note: parseFloat($('#edit-note').val()),
            notePublic: parseFloat($('#edit-notePublic').val()),
            description: $('#edit-description').val(),
            lienImage: $('#edit-lienImage').val(),
            origine: $('#edit-origine').val()
        };
    
        console.log("Sending PUT request with data:", formData); // Debugging: Log the data being sent
    
        $.ajax({
            url: `http://localhost:3000/movies/${movieId}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function (response) {
                if (response.success) {
                    alert("Film modifié avec succès !");
                    $('#edit-movie-form').hide(); // Hide the form
    
                    // Refresh the movie list
                    const niveau = 'all';
                    const noteMin = $('#goodNote').val();
                    const noteMax = $('#badNote').val();
                    const origineFilm = $('#FiltrePays').val();
                    loadMovies(niveau, noteMin, noteMax, origineFilm); // Refresh the list
                } else {
                    alert('Erreur lors de la modification du film : ' + response.error);
                }
            },
            error: function (xhr, status, error) {
                console.error("Erreur :", error);
                alert('Erreur lors de la modification du film.');
            }
        });
    });

    $('#cancel-edit').click(function () {
        $('#edit-movie-form').hide();
    });


    $('#loadMoviesButton').on('click', function() {
        const niveau = 'all';
        const noteMin = $('#goodNote').val();
        const noteMax = $('#badNote').val();
        const origineFilm = $('#FiltrePays').val();
    
        //console.log("valeurs", { niveau, noteMin, noteMax, origineFilm });
    
        loadMovies(niveau, noteMin, noteMax, origineFilm);
    });

    $('#importBanger').on('click', function() {
        loadMovies('Banger', $('#goodNote').val(), null, $('#FiltrePays').val());
    });

    $('#importNavets').on('click', function() {
        loadMovies('Navet', null, $('#badNote').val(), $('#FiltrePays').val());
    });


    $('#clearButton').on('click', function() {
        $('#goodNote').val('');  
        $('#badNote').val('');   
        $('#FiltrePays').val(''); 
/*    
        $('#goodNote').parent().show();
        $('#badNote').parent().show();
*/   
        $('#movies-container').empty();
    });
});
