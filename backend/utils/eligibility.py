def check_eligibility(student_profile, job):
    """
    Compares student profile against job requirements.
    Returns: dict with 'is_eligible': bool and 'reasons': list of strings explaining why if ineligible.
    """
    reasons = []
    
    if not student_profile:
        return {
            "is_eligible": False,
            "reasons": ["Student profile data is missing. Please complete your profile first."]
        }
    
    academic = student_profile.get("academic_info", {})
    
    # Check Profile Completion Status
    if not academic.get("department") or academic.get("cgpa") is None:
        return {
            "is_eligible": False,
            "reasons": ["Academic details (Department and CGPA) are incomplete in your profile."]
        }
        
    # 1. CGPA Check
    min_cgpa = float(job.get("min_cgpa") or 0.0)
    student_cgpa = float(academic.get("cgpa") or 0.0)
    if student_cgpa < min_cgpa:
        reasons.append(f"Minimum CGPA required: {min_cgpa:.1f} (Your CGPA: {student_cgpa:.1f})")

    # 2. Branch / Department Check
    eligible_branches = job.get("eligible_branches", [])
    if isinstance(eligible_branches, str):
        eligible_branches = [b.strip() for b in eligible_branches.split(",") if b.strip()]
        
    student_branch = (academic.get("department") or "").strip().upper()
    if eligible_branches and "ALL" not in [b.upper() for b in eligible_branches] and "ANY" not in [b.upper() for b in eligible_branches]:
        formatted_branches = [b.upper() for b in eligible_branches]
        if student_branch not in formatted_branches:
            reasons.append(f"Allowed Branches: {', '.join(eligible_branches)} (Your Branch: {student_branch or 'Not specified'})")

    # 3. Active Backlogs Check
    max_backlogs = job.get("max_backlogs")
    if max_backlogs is not None:
        max_backlogs = int(max_backlogs)
        student_backlogs = int(academic.get("active_backlogs") or 0)
        if student_backlogs > max_backlogs:
            reasons.append(f"Maximum active backlogs allowed: {max_backlogs} (Your active backlogs: {student_backlogs})")

    # 4. Graduation Year Check
    job_grad_year = job.get("graduation_year")
    if job_grad_year:
        student_grad_year = str(academic.get("graduation_year") or "").strip()
        if student_grad_year and str(job_grad_year).strip() != student_grad_year:
            reasons.append(f"Eligible Graduation Year: {job_grad_year} (Your Graduation Year: {student_grad_year})")

    # 5. 10th Percentage Check
    min_tenth = job.get("min_tenth_percentage")
    if min_tenth is not None and min_tenth != "":
        min_tenth = float(min_tenth)
        student_tenth = float(academic.get("tenth_percentage") or 0.0)
        if student_tenth < min_tenth:
            reasons.append(f"Minimum 10th percentage required: {min_tenth:.1f}% (Your score: {student_tenth:.1f}%)")

    # 6. 12th / Diploma Percentage Check
    min_twelfth = job.get("min_twelfth_percentage")
    if min_twelfth is not None and min_twelfth != "":
        min_twelfth = float(min_twelfth)
        student_twelfth = float(academic.get("twelfth_percentage") or academic.get("diploma_percentage") or 0.0)
        if student_twelfth < min_twelfth:
            reasons.append(f"Minimum 12th/Diploma percentage required: {min_twelfth:.1f}% (Your score: {student_twelfth:.1f}%)")

    is_eligible = len(reasons) == 0
    return {
        "is_eligible": is_eligible,
        "reasons": reasons
    }
