export interface Product {
name: any;
    selectedSize: any;
    Size_Name: string;
  
    Product_Name: string;
    Product_Code_Id: any;
    Category_Id:any;
    MRP:any;
    Short_Description:any;
    P_URL:any;
    Description1:any;
    Quantity:any;
    Rate:any;
    Image_Status1:any;
    Meta_Description:any;
    Meta_Title:any;
    Offer_Description1:any;
    Offer_Qty:any;
    Offer_Rate:any;
    P_Description:any;
    P_Rate:any;
    Product_Image_Id:any;
    Product_Offer_Id:any;
    Product_Size_Id:any;
    Size_Chart_Id:any;
    Size_Chest:any;
    Item_Code:any;
    Item_Amt:any;
    Item_Net_Amt:any;
    Status1:any;
    quantity?: any;
    Images:any[];
    Sizes:any[];
    Offers:any[];
    isFilled: boolean; 
    // Add other properties as needed
  menu_name?: string; // Add this property
  }
  export interface CartItem {
    product: Product;
    quantity: any;
    Product_Code_Id: any;
    Quantity: any;
    Item_Amt:any;
    Item_Net_Amt:any;
  
  }
  export interface Customer {
    Email_Id: any;
    User_Id:any;
    User_Name:any;
    Password1: any;
   // mobile: any;
    F_Name:any;
    L_Name:any;
    Mobile_No:any;
    Address_1:any;
    Address_2:any;
    Address_3:any;
    Address_4:any;
    Address_5:any;
    User_Type:any;
    Status1:any;
  
  }
  
  export interface Images {
    animationClass: string;
    I_Gallery_Id: any;
    I_Gallery_Name: any;
  
    I_Gallery_Path: any;
    Rank1: any;
    Status1: any;
  
  }