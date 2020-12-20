function formValidations() {
    $( "#Total_Bill" ).focusout(function() {
        var Total_Bill = $( "#Total_Bill" ).val();
        var valor = parseFloat(Math.round(Total_Bill * 100) / 100).toFixed(2);
        $( "#Total_Bill" ).val(valor);
    });

    $( "#Total_Bill" ).keyup(function() {
        var Total_Bill = $( "#Total_Bill" ).val();
        if(Total_Bill <= 0){
            $('.showerror0').show();
        }else{
            $('.showerror0').hide();
        }
    });

    
};


