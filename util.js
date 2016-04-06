var u;
if(typeof(u) != "object")
{
	u = {};

	//returns new value that is closer to target from curr 
	//by at most maxStep. 
	//
	//maxStep must be positive
	u.approach = function(target, curr, maxStep) {
		if(Math.abs(target - curr) > Math.abs(maxStep)) {
			var neg = (target - curr) < 0;
			return curr + maxStep * (neg?-1:1);
		} else {
			return target; 
		}
	}


}
