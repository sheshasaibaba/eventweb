/**
 * Created by Uday on 06-12-2019.
 */

function Payment(keys) {

    console.log(keys);
    /*
     var keys = {
             key :'Zp3r6LSv',
             txnid : 'ORD1250188',
             amount : 10000,
             fname: "uday",
             email: "uday@gmail.com",
             pinfo: "testinfo",
             udf5 : 'BOLT_KIT_NODE_JS',
             salt : 'Zui7VByBWc',
             eventId: event.EventId,
             NoOfTickets: event.NoOfTickets,
             UserId: CustomerInfo.RequestBy,
           }
    
     userid: keys.UserId,
     nooftickets: keys.NoOfTickets,
        */
    var url = window.location.protocol + '//' + window.location.hostname + '/#/home/user/orders';
    var failedurl = window.location.protocol + '//' + window.location.hostname + '/#/home/order/fail';
    var redirecturl = window.location.protocol + '//' + window.location.hostname + '/#/home/user/orders';
    bolt.launch({
        key: keys.key,
        txnid: keys.txnid,
        hash: keys.hash,
        amount: keys.amount,
        firstname: keys.fname,
        email: keys.email,
        phone: keys.phone,
        productinfo: keys.pinfo,
        udf5: keys.udf5,
        surl: url,
        furl: failedurl
    }, {
        responseHandler: function (BOLT) {
            alert(BOLT.response.txnStatus);
            console.log(BOLT.response);

            if (BOLT.response.txnStatus == 'SUCCESS') {
                sessionStorage.setItem('TxnId', BOLT.response.txnid);
                sessionStorage.setItem('TxnStatus', BOLT.response.txnStatus);

                window.location.href = redirecturl;
            } else {
                if (BOLT.response.txnStatus == 'CANCEL') {
                    window.location.href = failedurl;
                } else {
                    sessionStorage.setItem('TxnId', BOLT.response.txnid);
                    sessionStorage.setItem('TxnStatus', BOLT.response.txnStatus);

                    //Salt is passd here for demo purpose only. For practical use keep salt at server side only.
                    var fr = '<form action=\"' + $('#surl').val() + '\" >' +
                        '<input type=\"hidden\" name=\"key\" value=\"' + BOLT.response.key + '\" />' +
                        '<input type=\"hidden\" name=\"salt\" value=\"' + $('#salt').val() + '\" />' +
                        '<input type=\"hidden\" name=\"txnid\" value=\"' + BOLT.response.txnid + '\" />' +
                        '<input type=\"hidden\" name=\"amount\" value=\"' + BOLT.response.amount + '\" />' +
                        '<input type=\"hidden\" name=\"productinfo\" value=\"' + BOLT.response.productinfo + '\" />' +
                        '<input type=\"hidden\" name=\"firstname\" value=\"' + BOLT.response.firstname + '\" />' +
                        '<input type=\"hidden\" name=\"email\" value=\"' + BOLT.response.email + '\" />' +
                        '<input type=\"hidden\" name=\"udf5\" value=\"' + BOLT.response.udf5 + '\" />' +
                        '<input type=\"hidden\" name=\"mihpayid\" value=\"' + BOLT.response.mihpayid + '\" />' +
                        '<input type=\"hidden\" name=\"status\" value=\"' + BOLT.response.status + '\" />' +
                        '<input type=\"hidden\" name=\"hash\" value=\"' + BOLT.response.hash + '\" />' +
                        '</form>';
                    var form = jQuery(fr);
                    jQuery('body').append(form);
                    form.submit();
                }
            }
        },
        catchException: function (BOLT) {
            alert(BOLT.message);
        }
    });

}

