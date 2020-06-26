//Storage Controller
const StorageCtrl =(()=>{



    //Public Methods
    return{
        storeItem:(item)=>{
            let items;
            if(localStorage.getItem('items')===null){
                items= [];
                items.push(item);

                localStorage.setItem('items',JSON.stringify(items));

            }else{

                items = JSON.parse(localStorage.getItem('items'));
                items.push(item);

                localStorage.setItem('items',JSON.stringify(items));

            }
        },

        getItemsFormStorage:()=>{
            let items;
            if(localStorage.getItem('items')===null){
                items=[];


            }else{
                items= JSON.parse(localStorage.getItem('items'))

            }
            return items;
        },
        UpdateItemStorage:(updatedItem)=>{
            let items = JSON.parse(localStorage.getItem('items'))
            items.forEach((item,index)=>{
                if(updatedItem.id === item.id){
                    items.splice(index,1, updatedItem)

                }
            })

            localStorage.setItem('items', JSON.stringify(items));
        },

        deleteItemFromStorage:(id)=>{

            let items = JSON.parse(localStorage.getItem('items'))
            items.forEach((item,index)=>{
                if(id === item.id){
                    items.splice(index,1)

                }
            })

            localStorage.setItem('items', JSON.stringify(items));

        },

        ClearItemsStorage:()=>{
            localStorage.removeItem('items');
        }

    }

})()






// Item Controller

const ItemCtrl = (() =>{
    // Item Constructor
    class Item{
    constructor (id,name, calories){
        this.id =id;
        this.name=name;
        this.calories=calories;
    }
} 

    const data = {
       
        items:StorageCtrl.getItemsFormStorage(),

            CurrentItem:null,
            totalCalories:0
            
        
        }

         // Public Methods
        return{

            getItems:()=>{
                return data.items;

            },

            addItem:(name, calories)=>{
                let ID;
                // Create new ID
                if(data.items.length > 0){
                    ID = data.items[data.items.length - 1].id + 1;
                }else{
                    ID= 0;
                }

                // Calories to number
                calories = parseInt(calories);

                // Create new Item

                newItem = new Item (ID,name,calories)
                
                data.items.push(newItem);

                return newItem;
            },

            getItemByID:(id)=>{
                let found = null;
                data.items.forEach((item)=>{
                    if(item.id===id){
                        found=item;

                    }
                    
                })
                return found;
            },

            UpdateItem:(name,calories)=>{
                //Convert calories Into Number
                calories = parseInt(calories)

                let found = null;
                data.items.forEach((item)=>{
                    if(item.id ===data.CurrentItem.id){
                        item.name =name;
                        item.calories = calories
                        found =item;

                    }
                    
                })
                return found;
            },

            deleteItem:(id)=>{
                const ids = data.items.map((item)=>{
                    return item.id;
                })

                const index= ids.indexOf(id);

                data.items.splice(index, 1)
            },

            ClearALLItemsUI:()=>{
                data.items=[];
            },



            setCurrentItem:(item)=>{
                data.CurrentItem = item;
            },
            getCurrentItem:()=>{
                return data.CurrentItem;
            },

            getTotalCalories:()=>{
                let output = 0;
                data.items.forEach((item)=>{
                    output+=item.calories;
                })

                data.totalCalories=output;

                return data.totalCalories;
            },

            logData:()=>{
                return data;
            }
        }

})();

     

//UI Controller


const UiCtrl= (() =>{

    const UISelector = {
        itemList:'#item-list',
        addBtn:'.add-btn',
        DeleteBtn:'.delete-btn',
        UpdateBtn:'.update-btn',
        BackBtn:'.back-btn',
        ClearBtn:'.clear-btn',
        itemNameInput:'#item-name',
        itemCalorieInput:'#item-calories',
        totalcalories:'.total-calories',
        listItems:'#item-list li'

    }

     // Public Method
    return{
        populateList:(item1)=>{
            let Output = '';

            item1.forEach((item2)=>{
                Output+=`<li class="collection-item" id="item-${item2.id}"> <strong>${item2.name}</strong> <em>${item2.calories} Calories</em>
                <a href="#" class="secondary-content">
                        <i class="edit-item fas fa-edit"></i>
                </a>
                </li>`
            })

            document.querySelector(UISelector.itemList).innerHTML = Output;

          
        },

        getItem:()=>{
            return{
                name:document.querySelector(UISelector.itemNameInput).value,
                calorie:document.querySelector(UISelector.itemCalorieInput).value


            }
        },
        addListItem:(item)=>{
            document.querySelector(UISelector.itemList).style.display='block';
            const li = document.createElement('li');
            li.className='collection-item';
            li.id=`item-${item.id}`;
            li.innerHTML=` <strong>${item.name}</strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
                    <i class="edit-item fas fa-edit"></i>
            </a>`

            document.querySelector(UISelector.itemList).insertAdjacentElement('beforeend',li)

        },

        UpdateListItem:(item)=>{
            let listItem= document.querySelectorAll(UISelector.listItems)

            // Turn Node into Array
            listItem = Array.from(listItem)

            listItem.forEach((list)=>{
                const ItemID = list.getAttribute('ID');


                if(ItemID === `item-${item.id}`){
                    document.querySelector(`#${ItemID}`).innerHTML=`<strong>${item.name}</strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                            <i class="edit-item fas fa-edit"></i>
                    </a>`

                }
            })



        },

        deleteItemUI:(id)=>{
            const ItemID =`#item-${id}`;
            const item = document.querySelector(ItemID);
            item.remove();
        },

        removeItems:()=>{
            let listItems = document.querySelectorAll(UISelector.listItems);

            listItems = Array.from(listItems);
            
            listItems.forEach((item)=>{
                item.remove();
            })

        },

        clearFields:()=>{
            document.querySelector(UISelector.itemNameInput).value='';
            document.querySelector(UISelector.itemCalorieInput).value='';
        },

        addItemToForm:()=>{
            document.querySelector(UISelector.itemNameInput).value= ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelector.itemCalorieInput).value=ItemCtrl.getCurrentItem().calories;
            UiCtrl.showEdit();
        },

        hideList:()=>{
            document.querySelector(UISelector.itemList).style.display='none';
        },

        showTotalCalories:(total)=>{
            document.querySelector(UISelector.totalcalories).textContent=total;
        },

        clearEdit:()=>{
            UiCtrl.clearFields();
            document.querySelector(UISelector.addBtn).style.display='inline';
            document.querySelector(UISelector.DeleteBtn).style.display='none';
            document.querySelector(UISelector.UpdateBtn).style.display='none';
            document.querySelector(UISelector.BackBtn).style.display='none';
        },
        showEdit:()=>{
            
            document.querySelector(UISelector.addBtn).style.display='none';
            document.querySelector(UISelector.DeleteBtn).style.display='inline';
            document.querySelector(UISelector.UpdateBtn).style.display='inline';
            document.querySelector(UISelector.BackBtn).style.display='inline';
        },

        getSelectors:()=>{
            return UISelector;

        }

    }
    
})();

//App Controller

const App = ((ItemCtrl, StorageCtrl, UiCtrl) =>{

  //  console.log(ItemCtrl.logData());


  // Load Event Listeners
  const loadEventListeners = ()=>{

    // Get UI Selector
    const UiSelector1 =UiCtrl.getSelectors();

    document.querySelector(UiSelector1.addBtn).addEventListener('click', itemAddSubmit)

    // Disable keypress/ enter key
    document.addEventListener('keypress',(e)=>{
        if(e.keyCode===13 || e.which===13){
            e.preventDefault();
            return false;
        }
    })

    document.querySelector(UiSelector1.itemList).addEventListener('click',itemEditClick)

    document.querySelector(UiSelector1.UpdateBtn).addEventListener('click',itemUpdateSubmit)


    document.querySelector(UiSelector1.DeleteBtn).addEventListener('click',itemDeleteSubmit)


    document.querySelector(UiSelector1.BackBtn).addEventListener('click',BackBtnCall);

    document.querySelector(UiSelector1.ClearBtn).addEventListener('click',ClearALLItems);


  }

  const itemAddSubmit = (e)=>{
   
   

   const input1 = UiCtrl.getItem();

  


  //CHECK FOR NAME AND CALORIE INPUT

  if(input1.name!=='' && input1.calorie!==''){
   

   const newItem = ItemCtrl.addItem(input1.name, input1.calorie);

   UiCtrl.addListItem(newItem);

   // get Total Calories
    const totalCalories = ItemCtrl.getTotalCalories();

    UiCtrl.showTotalCalories(totalCalories);

    StorageCtrl.storeItem(newItem);

   UiCtrl.clearFields();

   e.preventDefault();
  }


  
  }

  const itemEditClick = (e)=>{
   

    
    if(e.target.classList.contains('edit-item')){

        const ListId = e.target.parentNode.parentNode.id;
       

        const ListIdArr = ListId.split('-');
     


        const id = parseInt(ListIdArr[1]); // pareseInt means convert to number

        const itemToEdit = ItemCtrl.getItemByID(id);



       ItemCtrl.setCurrentItem(itemToEdit);

       UiCtrl.addItemToForm();


       e.preventDefault();


    }



    
  }

  const itemUpdateSubmit = (e)=>{
   

    // get Item
   const input = UiCtrl.getItem();

   //Update Item

   const UpdateItem = ItemCtrl.UpdateItem(input.name, input.calorie);

   UiCtrl.UpdateListItem(UpdateItem);

   const totalCalories = ItemCtrl.getTotalCalories();

   UiCtrl.showTotalCalories(totalCalories);

   StorageCtrl.UpdateItemStorage(UpdateItem);

   UiCtrl.clearEdit();

   e.preventDefault();
  }


  const BackBtnCall = (e)=>{
     

      UiCtrl.clearEdit();
  }

  const itemDeleteSubmit = (e)=>{
     
 

   const currentItem = ItemCtrl.getCurrentItem();

   ItemCtrl.deleteItem(clientInformation);

   UiCtrl.deleteItemUI(currentItem.id);

   UiCtrl.hideList();

   const totalCalories = ItemCtrl.getTotalCalories();

   UiCtrl.showTotalCalories(totalCalories);

   StorageCtrl.deleteItemFromStorage(currentItem.id);

   UiCtrl.clearEdit();

   e.preventDefault();

  }



  const ClearALLItems =(e)=>{
   
    ItemCtrl.ClearALLItemsUI();

    const totalCalories = ItemCtrl.getTotalCalories();

    UiCtrl.showTotalCalories(totalCalories);

    UiCtrl.removeItems();

    StorageCtrl.ClearItemsStorage();

    UiCtrl.hideList();


    


   
  }

  


    // Public Method
  return{
      init:()=>{
            // Set Initial State/ Clear Edit State
            UiCtrl.clearEdit();

         // console.log('Initializing APP..');

         const itemList = ItemCtrl.getItems();

         if(itemList.length===0){
             UiCtrl.hideList();

         }else{
            UiCtrl.populateList(itemList);
         }

         

         // load Event Listeners
         loadEventListeners();

      }
  }
    
})(ItemCtrl, StorageCtrl, UiCtrl);


//Initialize App
App.init();


