export const editorConfig = {
    alignment: {
        options: [ 'left', 'right' ]
    },
    toolbar: {
        items: [
            'bold',
            'italic',
            'link',
            '|',
            'bulletedList',
            'numberedList',
            '|',
            'outdent', 
            'indent',
            '|',
            'undo',
            'redo'
        ],
        shouldNotGroupWhenFull: true
    }
}

export const token = process.env.REACT_APP_API_SECRET

export default {
    MAX_HEIGHT_JUMBO: 350,
    MIN_HEIGHT_JUMBO: 350
}