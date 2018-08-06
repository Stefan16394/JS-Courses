
let receiptService=(()=>{

    function getActiveReceipt(){
        let userId=sessionStorage.getItem("userId")
        let endpoint=`receipts?query={"_acl.creator":"${userId}","active":"true"}`
        return requester.get("appdata",endpoint,'kinvey')
    }

    function createReceipt(data){
        return requester.post("appdata","receipts","kinvey",data)
    }

    function getProductsByReceiptId(id){
        let endpoint=`entries?query={"receiptId":"${id}"}`
        return requester.get("appdata",endpoint,"kinvey")
    }

    function createNewProduct(data){
        return requester.post("appdata","entries","kinvey",data)
    }

    function updateAfterModifyingProduct(id,data){
        return requester.update("appdata",`receipts/${id}`,"kinvey",data)
    }

    function getReceiptById(id){
        return requester.get("appdata",`receipts/${id}`,"kinvey")
    }

    function deleteProduct(id){
        return requester.remove("appdata",`entries/${id}`,"kinvey")
    }

    function getProductById(id){
        return requester.get("appdata",`entries/${id}`,"kinvey")
    }

    function getMyReceipts(id){
        let endpoint=`receipts?query={"_acl.creator":"${id}","active":"false"}`
        return requester.get("appdata",endpoint,"kinvey")
    }

    return{
        getActiveReceipt,
        createReceipt,
        getProductsByReceiptId,
        createNewProduct,
        updateAfterModifyingProduct,
        getReceiptById,
        deleteProduct,
        getProductById,
        getMyReceipts
    }
})()