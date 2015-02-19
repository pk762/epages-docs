(function ($) {
    var SearchForm = function (searchUrl, $searchForm, $searchBox, $searchResults) {
        var $searchForm = $($searchForm);
        var $searchBox = $($searchBox);
        var $searchResults = $($searchResults);

        var createQueryData = function (query) {
            return {
                query: {
                    match_phrase: {
                        content: query
                    }
                },
                highlight: {
                    fields: {
                        content: {}
                    }
                }
            };
        };

        var renderResults = function (data) {
            $searchResults.children().remove();
            if (data.hits.total > 0) {
                $.each(data.hits.hits, function (i, hit) {
                    link_html = '<a href="' + hit._source.url + '">' + hit._source.title + '</a> <span>(' + (hit._score * 100).toFixed(2) + ' %)</span></div>';
                    highlight_html = '';
                    $.each(hit.highlight.content, function (j, highlight) {
                        highlight_html += '<span class="search-highlight">' + highlight + '</span>';
                    });
                    $searchResults.append('<li class="search-result"><div>' + link_html + '</div><div>' + highlight_html + '</div></li>');
                });
            } else {
                $searchResults.append('<li class="no-search-result"><div>No results.</div></li>');
            }
        };

        $searchForm.submit(function (event) {
            event.preventDefault();

            $.ajax({
                type: 'POST',
                url: searchUrl,
                data: JSON.stringify(createQueryData($searchBox.val())),
                dataType: 'json',
                contentType: 'application/json; charset=utf-8'
            }).done(function (data, textStatus, xhr) {
                $searchResults.children().remove();
                if (data.hits.total > 0) {
                    $.each(data.hits.hits, function (i, hit) {
                        link_html = '<a href="' + hit._source.url + '">' + hit._source.title + '</a> <span>(' + (hit._score * 100).toFixed(2) + ' %)</span></div>';
                        highlight_html = '';
                        $.each(hit.highlight.content, function (j, highlight) {
                            highlight_html += '<span class="search-highlight">' + highlight + '</span>';
                        });
                        $searchResults.append('<li class="search-result"><div>' + link_html + '</div><div>' + highlight_html + '</div></li>');
                    });
                } else {
                    $searchResults.append('<li class="no-search-result"><div>No results.</div></li>');
                }
            }).fail(function (xhr, textStatus, err) {
                window.alert(err);
            });
        });
    };

    window.SearchForm = SearchForm;
})(jQuery);
