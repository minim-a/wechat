
module.exports=Ticket;
function Ticket(){
}

Ticket.init=function(){
    if (!Ticket._init){
        Ticket._ticket={};
        Ticket._init=true;
    }
}

Ticket.getTicket =function(){
    return Ticket._ticket;
}

Ticket.saveTicket =function(data){
    Ticket._ticket=data;
}

Ticket.init();