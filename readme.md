## TODO:

* visually denote years post FI
* add disclaimer
* add information about how to calculate various values and present in both the intro and edit screens
* add "more info" screen with links to MMM, jlcollins, ... "BEST OF" - these links should be pulled from the cloud so they can be updated independently of the App
* allow user to adjust return and SWR percentages
* allow user to adjust retirement expenses separately

Considering:
* show graph view when editing a value
* show monte-carlo projections like FIRECALC? PROBABLY NOT THOUGH! Too complicated to understand
* link to or graph historic rates
* allow user to specify inflation?

## Notes:


### Done button issue
The iOS number pad keyboard does not have a 'done' button. In the Objective C
version of this app I created an InputAccessoryView with a 'done' button. I
don't think that's easily accomplished in React Native.

Maybe a better solution is presented here - http://stackoverflow.com/questions/29685421/react-native-hide-keyboard

### no built-in React Native support for picker with multiple components

https://github.com/veddermatic/react-native-multipicker

### no built in support for UITableView (ListView doable?)

# Notes to share with user

simple inputs to promote playing around with different scenarios

imprecise inputs to avoid false precision

taxes? assume income grows with inflation. Dollar amounts are in today's earning potential
pre-tax, post-tax? assumes you have access to the cash at retirement (likely you'll have a mix of tax advantaged and non tax advantaged funds, or could use a roth conversion ladder). Tax gain harvesting to lower taxes. If you have a paid off house, you won't need as much money to live on and will be in a lower tax bracket. Don't plan for retirement based on your annual income, plan based on your annual spending. If you make 100000 today and save 40k, you only need to withdraw 60k to maintain the same lifestyle. You may need less than that because you'll be in a lower tax bracket and may not have any earned income.

Dont bother entering precise numbers - estimates won't pan out precisely anyways

# installation
npm install
rnpm link
