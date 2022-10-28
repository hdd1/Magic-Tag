$(document).ready(function(){

    $.fn.magicTags = function (params) {

        /**
         * Params:
         * placeholder: Надпись на Input-е, пока ничего нет
         * label: метка блока
         * listBoxMaxHeight: Максимальный размер выпадающего списка. По умолчанию - половина размера экрана
         * searchInListBox [true|false]: Где будет находиться окно быстрого поиска: внутри Инпута или внутри выпадающего списка
         * search [true|false]: будет ли быстрый поиск
         * multiselect [true|false]: можно ли выбирать несколько опций или только одну
         * ifOneSelected [true|false]: если всего одно значение - сразу его и выбирать
         * selected: массив ID элементов, которые должны быть выбраны
         * data: данные из которых, собственно, и надо выбирать
         */


        if (params.data === undefined){
            console.log('Не передали данные');
            return false;
        }
        if (params.placeholder === undefined){
            params.placeholder = 'Select...';
        }
        if (params.listBoxMaxHeight === undefined || Number(params.listBoxMaxHeight) === 0){
            params.listBoxMaxHeight = $(window).height() / 2;
            if (params.listBoxMaxHeight < 200) params.listBoxMaxHeight = 200
        }
        if (params.searchInListBox === undefined) {
            params.searchInListBox = false;
        } else {
            params.searchInListBox = Boolean(params.searchInListBox);
        }
        if (params.searchPlaceholder === undefined){
            params.searchPlaceholder = 'Search...';
        }
        if (params.multiselect === undefined){
            params.multiselect = true;
        }else{
            params.multiselect = Boolean(params.multiselect);
        }
        if (params.ifOneSelected === undefined) {
            params.ifOneSelected = true;
        }else{
            params.ifOneSelected = Boolean(params.ifOneSelected);
        }
        if (params.selected === undefined){
            params.selected = [];
        }

        const $box = $(this);
        $box.addClass('mtags-form-tags').empty();

        if (params.label !== undefined){
            $box.append($('<label/>').attr('label-for', $box.attr('id')).text(params.label));
        }

        const $input = $('<input>').attr('type', 'text').addClass('mtags-input');
        if (params.search !== undefined && params.search === false) $input.css('display', 'none');

        const $inputBox = $('<div/>').addClass('mtags-input-box');
        const $placeholder = $('<span/>').addClass('mtags-placeholder').text(params.placeholder);
        $inputBox.append($placeholder);

        if (params.searchInListBox !== true){
            $inputBox.append($input);
        }

        const $listBox = $('<div/>').addClass('mtags-list-box');
        const $list = $('<div/>').addClass('mtags-list');
        if (params.searchInListBox === true){
            $listBox.append($('<i/>').addClass('mtags-search-ico fa fa-search fa-lg'));
            $input.attr('placeholder', params.searchPlaceholder)
            $listBox.append($input);
        }
        $listBox.append($list);
        $box.append($inputBox);
        $box.append($listBox);

        $list.css('max-height', params.listBoxMaxHeight + 'px');

        let isOneSelected = params.ifOneSelected === true && params.data.length === 1;

        $.each(params.data, function (e, v){
            if(v.divider !== undefined){
                $list.append($('<div/>').addClass('mtags-list-divider').text(v.divider));
                return;
            }
            let $item = $('<div/>').addClass('mtags-list-item').attr('data-id', v.id).html(v.name)
            if (v.addClass !== undefined && v.addClass != '') {
                $item.addClass(v.addClass);
            }
            $list.append($item);

            if (v.selected === true || isOneSelected || $.inArray(v.id, params.selected) !== -1){
                clickListItem($item);
            }
        })

        $input.keyup(function (e){
            if (e.keyCode === 13) {
                e.preventDefault();
                removeActive();
                return;
            }
            $list.find('.mtags-list-item').each(function (){
                if($input.val() == ''){
                    listBoxResetView();
                }else{
                    if($(this).text().toLowerCase().includes($input.val().toLowerCase())){
                        $(this).removeClass('h');
                    }else{
                        $(this).addClass('h');
                    }
                }

            });
            placeholderVerify();
        })

        $box.click(function (){
            $box.addClass('active');
            $input.focus();
        })

        $(document).mouseup(function (e) {
            if ($box.has(e.target).length === 0){
                removeActive();
            }
        });

        placeholderVerify();

        $list.find('.mtags-list-item').click(function (){
            clickListItem($(this));
        });

        function clickListItem(obj){
            if (params.multiselect === true){

            }else{
                $inputBox.find('.mtags-input-item').remove();
                $listBox.find('.mtags-list-item').removeClass('selected');
            }

            obj.addClass('selected');
            let $item = $('<div/>').addClass('mtags-input-item').attr('data-id', obj.attr('data-id')).html(obj.html());
            if (params.searchInListBox === true){
                $inputBox.append($item);
            }else{
                $item.insertBefore($input);
            }
            placeholderVerify();
        }

        $('body').on('click', '.mtags-input-item', function (){
            $list.find('.mtags-list-item[data-id="' + $(this).attr('data-id') +'"]').removeClass('selected');
            $(this).remove();
            placeholderVerify();
        })

        function removeActive(){
            $input.val('');
            listBoxResetView();
            $box.removeClass('active');
            placeholderVerify();
        }
        function listBoxResetView(){
            $list.find('.mtags-list-item').removeClass('h');
        }

        function placeholderVerify(){
            if($input.val() != '' || $inputBox.find('.mtags-input-item').length > 0) $placeholder.css('display', 'none');
            else $placeholder.css('display', 'block');
        }

        this.getSelectedID = function (){
            let res = [];
            $inputBox.find('.mtags-input-item').each(function (){
                res.push($(this).attr('data-id'));
            })
            return res;
        }

        return this;
    }

})