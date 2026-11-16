function selectSection(section) {
    $('#left_pane').find('div.selected').removeClass('selected');
    $('#section-selector_' + section).addClass('selected');
    $('#section_' + section).addClass('selected');

    const $maps = $('#section_' + section).find('.maps');
    if (!$maps.length || $maps.children().length) {
        return;
    }

    const fields = '{id,name,board,pos_x,pos_y,created,author,count_likes,count_games,difficulty}';
    const params = {
        entity: 'lbdl\\Map',
        domain: '[status,=,published]',
        fields: fields,
        limit: 15
    };

    switch (section) {
        case 'news':
            params.order = 'created';
            params.sort = 'desc';
            break;
        case 'easy':
            params.order = 'difficulty';
            params.sort = 'asc';
            break;
        case 'difficult':
            params.order = 'difficulty';
            params.sort = 'desc';
            break;
        case 'most-played':
            params.order = 'count_games';
            params.sort = 'desc';
            break;
        case 'most-liked':
            params.order = 'count_likes';
            params.sort = 'desc';
            break;
        default:
            console.warn('Unknown map section:', section);
            return;
    }

    const url = '/?get=model_collect&' + new URLSearchParams(params).toString();
    fetch(url)
        .then(async (response) => {
            if (!response.ok) {
                throw new Error('Map request failed with status ' + response.status);
            }
            const maps = await response.json();
            if (!Array.isArray(maps)) {
                throw new Error('Map response is not a list');
            }

            const $template = $('#template-map');
            maps.forEach((map) => {
                const formatter = Intl.NumberFormat('en', { notation: 'compact' });
                const $map = (new Map(map)).miniMap();
                const $item = $template.clone().removeAttr('id');
                $item.find('.map-thumb').append($map);
                $item.find('.map-name').text(map.name || '');
                $item.find('.map-author').text(map.author || '');
                if (map.difficulty >= 1 && map.difficulty <= 5) {
                    $item.find('.map-difficulty').append(
                        $('<img>').prop('src', 'assets/img/difficult_' + map.difficulty + '.png')
                    );
                }
                if (map.created) {
                    $item.find('.map-date').text(new Date(map.created).toLocaleDateString('fr-BE'));
                }
                $item.find('.map-likes').text(formatter.format(Number(map.count_likes) || 0));
                $item.find('.map-games').text(formatter.format(Number(map.count_games) || 0));
                $item.on('click', () => {
                    if (map.id != null) {
                        window.location.href = './play.html?level=' + encodeURIComponent(map.id);
                    }
                });
                $maps.append($item);
            });
        })
        .catch((error) => {
            console.warn('Something went wrong while requesting section.', error);
        });
}
