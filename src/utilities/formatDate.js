export default function formatDate(dateStr){
    var date = new Date(dateStr);
    return date.toLocaleDateString();
}