import React from 'react';

import styles from './PaymentHistoryIndividual.module.css';

function PaymentHistoryIndividual({ paymentDetails }) {
    return (
        <div className={styles.PaymentHistoryIndividualWrapper}>
            <p className={styles.PaymentUserName}>{paymentDetails.userName}</p>
            <p className={styles.PaymentAmount}> {`₹${paymentDetails.amount}`}</p>
            <p className={styles.PaymentTimestamp}>{paymentDetails.timestamp.toLocaleString()}</p>
        </div>
    );
}

export default PaymentHistoryIndividual
