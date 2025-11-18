import toast from 'react-hot-toast';

export const handleSuccess = (msg) => {
    toast.success(msg);
}

export const handleFailure = (msg) => {
    toast.error(msg);
}