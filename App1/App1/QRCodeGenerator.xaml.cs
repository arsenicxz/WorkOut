using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Xamarin.Forms;
using Xamarin.Forms.Xaml;
using ZXing;
using ZXing.Net;
using ZXing.Common;

namespace App1
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class QRCodeGenerator : ContentPage
    {
        public EncodingOptions BarcodeOptions => new EncodingOptions() { Height = 300, Width = 300, PureBarcode = true };
        public QRCodeGenerator()
        {
            InitializeComponent();
        }
    }
}

