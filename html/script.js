//初期マスター登録
init_set("init");

//初期化
function init_set(path){
    eel.set_master_item(path)();
    order_text.innerHTML = ""
    total_price.value = ""
    deposit_price.value = ""
    order_amount.value = ""
    change_function()
}
//python用関数
    //メニュー表を表示
    eel.expose(out_order_list)
    function out_order_list(json){
        data = JSON.parse(json)
        console.log(data)
        $("#master_order option").remove();
        var select = $("#master_order");
        var option = $('<option>')
            .text("注文を選択してください")
            .val("");
        select.append(option)
        for(var item in data["code"]){
            // console.log(item)
            var select = $("#master_order");
            var option = $('<option>')
                .text(data["name"][item])
                .val(data["code"][item]);
            select.append(option)
        }
    }
    //合計額を表示
    eel.expose(out_total_price)
    function out_total_price(value){
        total_price.value = value;
        change_function()
    }
    //アラート用
    eel.expose(alert_js)
    function alert_js(text){
        alert(text);
    }

//ボタン処理
    //マスターファイル変更
    file_btn.addEventListener('click', change_file)
    async function change_file(){
        var path = document.getElementById('master_file_path').value;
        // alert(path)
        init_set(path);
    }
    //選択注文削除
    delete_btn.addEventListener('click', delete_function)
    async function delete_function(){
        var del_element = document.getElementsByName("check_order")
        // console.log(del_element)
        var del_data = []
        for(let i=0; i<del_element.length; i++){
            if(del_element[i].checked){
                del_data.push(i)
                del_element[i].parentElement.remove()
            }
        }
        eel.delete_order(del_data)();
    }
    //注文削除
    clear_btn.addEventListener('click', clear_function)
    async function clear_function(){
        init_set("init")
    }
    //注文処理
    order_btn.addEventListener('click', order_function)
    async function order_function(){
        if(!master_order.value){
            alert("注文を入力して下さい")
        }else if(!order_amount.value){
            alert("注文数を入力して下さい")
        }else{
            eel.add_order(master_order.value,order_amount.value)();
            var name  = master_order.options[master_order.selectedIndex].text;
            out_order(name,master_order.value,order_amount.value)
        }
    }
    //注文を表示
    function out_order(name,id,amount){
        var div_element = document.createElement('div');
        var checkbox_element = document.createElement('input');
        checkbox_element.id = id+"-"+amount
        checkbox_element.class = "form-check-input"
        checkbox_element.type = "checkbox"
        checkbox_element.name = "check_order"
        var lebel_element = document.createElement('label');
        lebel_element.class = "form-check-label"
        lebel_element.for = id+"-"+amount
        lebel_element.textContent = name + " : " + amount

        div_element.appendChild(checkbox_element)
        div_element.appendChild(lebel_element)
        order_text.appendChild(div_element)
    }
    //お釣り計算
    deposit_price.addEventListener('change', change_function)
    async function change_function(){
        if(!deposit_price.value){
            deposit_price.value = 0
        }
        if(!total_price.value){
            total_price.value = 0
        }
        change_price = deposit_price.value - total_price.value
        change.value = change_price
    }
    //会計処理
    calc_btn.addEventListener('click', pay_function)
    async function pay_function(){
        eel.payment(deposit_price.value)();
        init_set("init");
    }