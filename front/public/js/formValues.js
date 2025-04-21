import { reactive } from "vue";

export default function useForm() {
const values = reactive({
    firstname: '',
    email: '',
    price: '',

});

return {
    values,
}

}