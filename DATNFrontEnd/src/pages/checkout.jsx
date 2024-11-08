import CheckoutStep from "../component/checkout/checkout.step"

const CheckoutPage = () => {
    return (
        <>
            <div
                style={{
                    paddingTop: 110,
                    width: 800,
                    justifyContent: 'center',
                    margin: '0 auto'
                }}
            >
                <CheckoutStep />
            </div>
        </>

    )
}

export default CheckoutPage