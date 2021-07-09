using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xamarin.Forms;
using ZXing;
using ZXing.Net;
using ZXing.Common;

namespace App1
{
    public partial class RegistrationPage : ContentPage
    {
        public RegistrationPage()
        {
            InitializeComponent();

        }

        protected override void OnAppearing()
        {
            StackLayout layout = new StackLayout();
            Label label1 = new Label();

            label1.Text = "Добро пожаловать в Коворкинг-Центр!";
            label1.TextColor = Color.Black;
            label1.FontSize = 30;
            label1.HorizontalOptions = LayoutOptions.Center;
            label1.FontAttributes = FontAttributes.Bold;
   

            Label label2 = new Label();

            label2.Text = "Отсканируйте QR-код";
            label2.TextColor = Color.Black;
            label2.FontSize = 20;
            label2.HorizontalOptions = LayoutOptions.Center;

            layout.Children.Add(label1);
            layout.Children.Add(label2);

            Content = layout;  
        }

        private void scanView_OnScanResult(Result result)
        {
            Device.BeginInvokeOnMainThread(async () =>
            {
                await DisplayAlert("Результат скана", result.Text, "Готово");
            });
        }
    }

}
