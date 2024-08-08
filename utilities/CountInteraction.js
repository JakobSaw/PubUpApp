import getValueLocally from './GetValueLocally';
import storeValueLocally from './StoreValueLocally';
import InAppReview from 'react-native-in-app-review';

export default async (test) => {
  const res = await getValueLocally('@InteractionCounts');
  if (res == null && !test) {
    storeValueLocally('@InteractionCounts', 1);
  } else if (res !== 'Done' || !!test) {
    if (+res > 15 || !!test) {
      console.log('InAppReview');
      storeValueLocally('@InteractionCounts', 'Done');

      InAppReview.isAvailable();
      InAppReview.RequestInAppReview()
        .then((hasFlowFinishedSuccessfully) => {
          // when return true in android it means user finished or close review flow
          console.log('InAppReview in android', hasFlowFinishedSuccessfully);

          // when return true in ios it means review flow lanuched to user.
          console.log(
            'InAppReview in ios has launched successfully',
            hasFlowFinishedSuccessfully,
          );

          // 1- you have option to do something ex: (navigate Home page) (in android).
          // 2- you have option to do something,
          // ex: (save date today to lanuch InAppReview after 15 days) (in android and ios).

          // 3- another option:
          if (hasFlowFinishedSuccessfully) {
            // do something for ios
            // do something for android
          }

          // for android:
          // The flow has finished. The API does not indicate whether the user
          // reviewed or not, or even whether the review dialog was shown. Thus, no
          // matter the result, we continue our app flow.

          // for ios
          // the flow lanuched successfully, The API does not indicate whether the user
          // reviewed or not, or he/she closed flow yet as android, Thus, no
          // matter the result, we continue our app flow.
        })
        .catch((error) => {
          console.log('Error InAppReview', error);
        });
    } else {
      storeValueLocally('@InteractionCounts', +res + 1);
    }
  }
};
